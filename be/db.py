from sqlalchemy import create_engine
from sqlalchemy.sql import text

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
    return result.mappings().all()

def get_users():
    stmt = text("select id, username from users")
    params = {}
    result = run_query(stmt, params)
    result.mappings().all()

create_user("p", "jpt")
get_user(1)
get_users()
