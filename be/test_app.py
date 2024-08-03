from app import create_app
from db import reset, create_user

import pytest


@pytest.fixture()
def app():
    app = create_app()
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


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
    response = client.get("/users/1")
    response = response.get_json()
    assert response == {"status": "success", "data": {"id": 1, "username": "user1"}}


def test_get_users_works(client):
    reset()
    create_user("user1", "password1")
    create_user("user2", "password2")

    response = client.get("/users")
    response = response.get_json()
    assert response == {
        "status": "success",
        "data": [{"id": 1, "username": "user1"}, {"id": 2, "username": "user2"}],
    }
