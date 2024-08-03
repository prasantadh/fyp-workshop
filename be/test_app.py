from werkzeug.wrappers import response
from app import create_app
from db import reset, create_user, follow_user

import pytest


@pytest.fixture()
def app():
    app = create_app()
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def token(client):
    reset()
    response = client.put(
        "/users", json={"username": "user1", "password": "password1"}
    ).get_json()

    response = client.post(
        "/users", json={"username": "user1", "password": "password1"}
    ).get_json()

    return response["data"]


def test_put_user_works(client):
    reset()
    # creating a user succeeds
    response = client.put("/users", json={"username": "user1", "password": "password1"})
    assert "success" in response.text

    # creating a duplicate user should fail
    response = client.put("/users", json={"username": "user1", "password": "password1"})
    assert "failure" in response.text


def test_get_user_works(client):
    reset()
    create_user("user1", "password1")
    response = client.get("/users/1").get_json()
    assert response == {"status": "success", "data": {"id": 1, "username": "user1"}}


def test_get_users_works(client):
    reset()
    create_user("user1", "password1")
    create_user("user2", "password2")

    response = client.get("/users").get_json()
    assert response == {
        "status": "success",
        "data": [{"id": 1, "username": "user1"}, {"id": 2, "username": "user2"}],
    }


def test_login_user_works(client):
    reset()
    create_user("user1", "password1")

    response = client.post(
        "/users", json={"username": "user1", "password": "password1"}
    ).get_json()
    assert response["status"] == "success"


def test_delete_user_works(client, token):
    response = client.delete(
        "/users", headers={"Authorization": "Bearer {}".format(token)}
    ).get_json()
    assert response == {"status": "success", "data": {"id": 1}}


def test_follow_user_works(client, token):
    create_user("user2", "password2")
    response = client.put(
        "/follows/2", headers={"Authorization": "Bearer {}".format(token)}
    ).get_json()
    assert response == {"status": "success", "data": {"followed": 2}}


def test_unfollow_user_works(client, token):
    create_user("user2", "password2")
    follow_user(1, 2)

    response = client.delete(
        "/follows/2", headers={"Authorization": "Bearer {}".format(token)}
    ).get_json()
    assert response == {"status": "success", "data": {"followed": 2}}


def test_get_followed_works(client, token):
    create_user("user2", "password2")
    create_user("user3", "password3")
    follow_user(1, 2)
    follow_user(1, 3)

    response = client.get(
        "/follows", headers={"Authorization": "Bearer {}".format(token)}
    ).get_json()
    assert response == {
        "status": "success",
        "data": [{"id": 2, "username": "user2"}, {"id": 3, "username": "user3"}],
    }


def test_get_followers_works(client, token):
    create_user("user2", "password2")
    create_user("user3", "password3")
    follow_user(2, 1)
    follow_user(3, 1)

    response = client.get(
        "/followers", headers={"Authorization": "Bearer {}".format(token)}
    ).get_json()
    assert response == {
        "status": "success",
        "data": [{"id": 2, "username": "user2"}, {"id": 3, "username": "user3"}],
    }