from sqlalchemy import create_engine
from sqlalchemy.sql import text

import unittest

# FIXME it seems psychopg2 needs to be installed
# for docker to be able to access postgresql
# will also need CREATE EXTENSION pgcrypto
# Picked SQL Alchemy because it also supports ORM if needed

def run_query(stmt, params):
    # FIXME use environment variable for secrets
    engine = create_engine("postgresql://bhakku@localhost:5432/twitter")
    with engine.connect() as conn:
        result = conn.execute(stmt, params)
        return result

def create_user(username, password):
    stmt = text("insert into users(username, password) values (:username, crypt(:password, gen_salt('bf'))) returning id")
    params = {"username": username, "password": password}
    result = run_query(stmt, params)
    return result.mappings().all()[0]

def get_user(id):
    stmt = text("select id, username from users where id=:id")
    params = {"id": id}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]

def get_users():
    stmt = text("select id, username from users")
    params = {}
    result = run_query(stmt, params)
    return result.mappings().all()

def login_user(username, password):
    # https://docs.vultr.com/how-to-securely-store-passwords-using-postgresql
    stmt = text("select id, (password = crypt(:password, password)) as match from users where username=:username")
    params = {"username": username, "password": password}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]

def change_password(id, password):
    stmt = text("update users set password=crypt(:password, gen_salt('bf')) where id=:id returning id")
    params = {'id': id, 'password': password}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]

def delete_user(id):
    stmt = text("delete from users where id=:id returning id")
    params = {'id': id}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]

def follow_user(follower, followed):
    stmt = text("insert into follows(follower, followed) values (:follower, :followed) returning follower as id")
    params = {'follower': follower, 'followed': followed}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]

def unfollow_user(follower, followed):
    stmt = text("delete from follows where follower=:follower and followed=:followed")
    params = {'follower': follower, followed: 'followed'}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]

def followed_users(current_user):
    stmt = text("select id, username from users where id in (select followed from follows where follower=:current_user)")
    params = {'current_user' : current_user}
    result = run_query(stmt, params)
    return result.mappings().all()

def followers(current_user):
    stmt = text("select id, username from users where id in (select follower from follows where followed=:current_user)")
    params = {'current_user': current_user}
    result = run_query(stmt, params)
    return result.mappings().all()

def create_tweet(user_id, content):
    stmt = text("insert into tweets(user_id, content, created_at) values (:user_id, :content, current_timestamp) returning id")
    params = {'user_id': user_id, 'content': content}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]

def get_tweet(id):
    stmt = text("select * from tweets where id =:id")
    params = {'id': id}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]

def get_tweets(user_id):
    stmt = text("select * from tweets where user_id=:user_id")
    params = {'user_id': user_id }
    result = run_query(stmt, params)
    return result.mappings().all()

def update_tweet(id, content):
    stmt = text("update tweets set content=:content where id=:id returning id")
    params = {'id': id, 'content': content}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]

def delete_tweet(id):
    stmt = text("delete from tweets where id=:id returning id")
    params = {'id': id}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]

# FIXME while we use seed.sql to populate data and test
# each test case should create its own data and cleanup afterwards
# this is because unittests can run in any order
# 
# It is also worth looking into 
# https://stackoverflow.com/questions/5342440/reset-auto-increment-counter-in-postgres 
# as they show how to reset counter.
# in the test cases if we delete all data, we might need to also reset
# counter to have predictable ids
class TestDbFunctions(unittest.TestCase):
    def test_get_user_works(self):
        self.assertEqual(get_user(1), {'id': 1, 'username': 'user1'}, "Should be user with id 1")
        self.assertEqual(get_user(100), {}, "Should not return user")

    def test_get_users_works(self):
        self.assertTrue({'id': 1, 'username': 'user1'} in get_users())
        self.assertTrue({'id': 2, 'username': 'user2'} in get_users())
        self.assertTrue({'id': 3, 'username': 'user3'} in get_users())
        self.assertTrue({'id': 4, 'username': 'user4'} in get_users())

    def test_login_user_works(self):
        self.assertEqual(login_user('user1', 'password1'), {'id': 1, 'match': True})
        self.assertEqual(login_user('user1', 'password2'), {'id': 1, 'match': False})
        self.assertEqual(login_user('user50', 'password2'), {})

    def test_change_password_works(self):
        self.assertEqual(change_password(2, '2password'), {'id': 2})
        self.assertEqual(login_user('user2', '2password'), {'id': 2, 'match': True})

    def test_create_user_works(self):
        self.assertEqual(create_user('user5', 'password5'), {'id': 5})
        # FIXME we haven't looked into what happens in failing
        # conditions. for example, what if we try to create the user
        # with already existing username? Currently, this crashes
        # the program. We are expected to handle this with a 
        # try...except block.
        # self.assertEqual(create_user('user5', 'password5'), {'id': 5})
    
    def test_delete_user_works(self):
        result = create_user('user6', 'password6')
        self.assertEqual(delete_user(result['id']), result)

    def test_follow_user_works(self):
        result = follow_user(3, 4);
        self.assertEqual(result, {'id': 3});
        # TODO can extend the test to see 4 is now in 3s followers

    def test_unfollow_user_works(self):
        result = follow_user(2, 4);
        self.assertEqual(result, {'id': 2})
        # TODO can extend the test to see 4 is not in 2s followers

    def test_followed_users_works(self):
        result = followed_users(1)
        self.assertTrue({'id': 3, 'username': 'user3'} in result)
        self.assertTrue({'id': 4, 'username': 'user4'} in result)
        self.assertTrue({'id': 2, 'username': 'user2'} not in result)

    def test_followers_works(self):
        result = followers(3)
        self.assertTrue({'id': 1, 'username': 'user1'} in result)
        self.assertTrue({'id': 2, 'username': 'user2'} in result)
        self.assertTrue({'id': 3, 'username': 'user3'} not in result)

    def test_create_tweet_works(self):
        result = create_tweet(1, "hello there again!")
        self.assertTrue('id' in result.keys())

    def test_get_tweet_works(self):
        result = get_tweet(1)
        self.assertEqual(result['content'], 'I am user1')

    def test_get_tweets_works(self):
        result = get_tweets(1)
        self.assertEqual(result[0].content, 'I am user1')
        self.assertEqual(result[1].content, 'hello there again!')

    def test_update_tweet_works(self):
        result = update_tweet(1, 'I am updated user1')
        self.assertEqual(get_tweet(1)['content'], 'I am updated user1' )

    def test_delete_tweet_works(self):
        result = create_tweet(1, 'only to be deleted')
        self.assertEqual(delete_tweet(result['id']), result)
    
if __name__ == '__main__':
    unittest.main()

