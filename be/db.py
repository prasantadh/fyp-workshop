from sqlalchemy import create_engine
from sqlalchemy.sql import text

import unittest

# # FIXME it seems psychopg2 needs to be installed
# # for docker to be able to access postgresql
# # will also need CREATE EXTENSION pgcrypto
# # Picked SQL Alchemy because it also supports ORM if needed

# # FIXME add function hints on documentation


def run_query(stmt, params):
    # FIXME use environment variable for secrets
    try:
        engine = create_engine("postgresql://postgres:postgres@localhost:5432/twitter")
        with engine.connect() as conn:
            result = conn.execute(stmt, params)
            conn.commit()
            conn.close()
            return result
    except:
        raise


def reset():
    with open("..\\db\\init.sql") as file:
        stmt = text(file.read())
        # if this fails, it is okay to crash, we don't want a try..except
        run_query(stmt, {})
    return

def create_user(username, password):
    stmt = text(
        "insert into users(username, password) values (:username, crypt(:password, gen_salt('bf'))) returning id"
    )
    params = {"username": username, "password": password}

    result = run_query(stmt, params)

    return result.mappings().all()[0]


def get_user(id):
    stmt = text("select id, username from users where id=:id")
    params = {"id": id}
    try:
        result = run_query(stmt, params)
    except:
        raise
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]


def get_users():
    stmt = text("select id, username from users")
    params = {}
    result = run_query(stmt, params)
    return result.mappings().all()


def login_user(username, password):
    # https://docs.vultr.com/how-to-securely-store-passwords-using-postgresql
    stmt = text(
        "select id, (password = crypt(:password, password)) as match from users where username=:username"
    )
    params = {"username": username, "password": password}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]

result = login_user('user1', 'password1')

def change_password(id, password):
    stmt = text(
        "UPDATE users SET password=crypt(:password, gen_salt('bf')) WHERE id=:id RETURNING id"
    )
    params = {"id": id, "password": password}
    result = run_query(stmt, params)  # Execute the query with the provided statement and parameters
    return result.mappings().all()[0]


def delete_user(id):
    stmt = text("delete from users where id=:id returning id")
    params = {"id": id}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]


def follow_user(follower, followed):
    stmt = text(
        "insert into follows(follower, followed) values (:follower, :followed) returning followed"
    )
    params = {"follower": follower, "followed": followed}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]


def unfollow_user(follower, followed):
    stmt = text(
        "delete from follows where follower=:follower and followed=:followed returning followed"
    )
    params = {"follower": follower, "followed": followed}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]


def followed_users(current_user):
    stmt = text(
        "select id, username from users where id in (select followed from follows where follower=:current_user)"
    )
    params = {"current_user": current_user}
    result = run_query(stmt, params)
    return result.mappings().all()


def followers(current_user):
    stmt = text(
        "select id, username from users where id in (select follower from follows where followed=:current_user)"
    )
    params = {"current_user": current_user}
    result = run_query(stmt, params)
    return result.mappings().all()


def create_tweet(user_id, content):
    stmt = text(
        "insert into tweets(user_id, content, created_at) values (:user_id, :content, current_timestamp) returning id"
    )
    params = {"user_id": user_id, "content": content}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]


def get_tweet(id):
    stmt = text("select * from tweets where id =:id")
    params = {"id": id}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]


def get_tweets(user_id):
    stmt = text("select * from tweets where user_id=:user_id")
    params = {"user_id": user_id}
    result = run_query(stmt, params)
    return result.mappings().all()


def update_tweet(id, content):
    stmt = text("update tweets set content=:content where id=:id returning id")
    params = {"id": id, "content": content}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]


def delete_tweet(id):
    stmt = text("delete from tweets where id=:id returning id")
    params = {"id": id}
    result = run_query(stmt, params)
    result = result.mappings().all()
    return {} if len(result) == 0 else result[0]


# # FIXME while we use seed.sql to populate data and test
# # each test case should create its own data and cleanup afterwards
# # this is because unittests can run in any order
# #
# # It is also worth looking into
# # https://stackoverflow.com/questions/5342440/reset-auto-increment-counter-in-postgres
# # as they show how to reset counter.
# # in the test cases if we delete all data, we might need to also reset
# # counter to have predictable ids
class TestDbFunctions(unittest.TestCase):
    def test_reset_db_works(self):
        reset()
        
    def test_create_user_works(self):
        reset()
        self.assertEqual(create_user("user1", "password1"), {"id": 1})
        with self.assertRaises(Exception):
            create_user("user1", "password1")
        # FIXME we haven't looked into what happens in failing
        # conditions. for example, what if we try to create the user
        # with already existing username? Currently, this crashes
        # the program. We are expected to handle this with a
        # try...except block.
        # self.assertEqual(create_user('user5', 'password5'), {'id': 5})

    def test_get_user_works(self):
        reset()
        create_user("user1", "password1")
        self.assertEqual(get_user(1), {"id": 1, "username": "user1"})
        self.assertEqual(get_user(2), {})

    def test_get_users_works(self):
        reset()
        create_user("user1", "password1")
        create_user("user2", "password2")
        create_user("user3", "password3")
        create_user("user4", "password4")
        returned = get_users()
        self.assertTrue({"id": 1, "username": "user1"} in returned)
        self.assertTrue({"id": 2, "username": "user2"} in returned)
        self.assertTrue({"id": 3, "username": "user3"} in returned)
        self.assertTrue({"id": 4, "username": "user4"} in returned)

    def test_login_user_works(self):
        reset()
        create_user("user1", "password1")
        self.assertEqual(login_user("user1", "password1"), {"id": 1, "match": True})
        self.assertEqual(login_user("user1", "password2"), {"id": 1, "match": False})
        self.assertEqual(login_user("user2", "password1"), {})

    def test_change_password_works(self):
        reset()
        create_user("user1", "password1")
        self.assertEqual(change_password(1, "1password"), {"id": 1})
        self.assertEqual(login_user("user1", "1password"), {"id": 1, "match": True})

    def test_delete_user_works(self):
        reset()
        result = create_user("user1", "password1")
        self.assertEqual(delete_user(1), result)
        self.assertEqual(get_user(1), {})

    def test_follow_user_works(self):
        reset()
        create_user("user1", "password1")
        create_user("user2", "password2")
        result = follow_user(1, 2)
        self.assertEqual(result, {"followed": 2})
        with self.assertRaises(Exception):
            follow_user(1, 3)
        with self.assertRaises(Exception):
            follow_user(3, 1)

    def test_unfollow_user_works(self):
        reset()
        create_user("user1", "password1")
        create_user("user2", "password2")
        self.assertEqual(unfollow_user(1, 2), {})
        follow_user(1, 2)
        self.assertEqual(unfollow_user(1, 2), {"followed": 2})

    def test_followed_users_works(self):
        reset()
        create_user("user1", "password1")
        create_user("user2", "password2")
        create_user("user3", "password3")
        follow_user(1, 2)
        follow_user(1, 3)
        result = followed_users(1)
        self.assertTrue({"id": 2, "username": "user2"} in result)
        self.assertTrue({"id": 3, "username": "user3"} in result)

    def test_followers_works(self):
        reset()
        create_user("user1", "password1")
        create_user("user2", "password2")
        create_user("user3", "password3")
        follow_user(2, 1)
        follow_user(3, 1)
        result = followers(1)
        self.assertTrue({"id": 2, "username": "user2"} in result)
        self.assertTrue({"id": 3, "username": "user3"} in result)

    def test_create_tweet_works(self):
        reset()
        create_user("user1", "password1")
        result = create_tweet(1, "hello there again!")
        self.assertEqual(result, {"id": 1})

    def test_get_tweet_works(self):
        reset()
        create_user("user1", "password1")
        create_tweet(1, "I am user1")
        result = get_tweet(1)
        self.assertTrue(result["content"], "I am user1")

    def test_get_tweets_works(self):
        reset()
        create_user("user1", "password1")
        create_tweet(1, "user1 here")
        create_tweet(1, "saying hello")
        result = get_tweets(1)
        self.assertEqual(result[0].content, "user1 here")
        self.assertEqual(result[1].content, "saying hello")

    def test_update_tweet_works(self):
        reset()
        create_user("user1", "password1")
        create_tweet(1, "hello")
        result = update_tweet(1, "hello world")
        self.assertEqual(result, {"id": 1})
        self.assertEqual(get_tweet(1)["content"], "hello world")

    def test_delete_tweet_works(self):
        reset()
        create_user("user1", "password1")
        create_tweet(1, "only to be deleted")
        self.assertEqual(delete_tweet(1), {"id": 1})
        self.assertEqual(get_tweet(1), {})


if __name__ == "__main__":
    unittest.main()
