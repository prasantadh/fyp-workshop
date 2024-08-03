from flask import Flask
from flask import request

from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

import db


def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "FIXME-CHANGE-THIS"
    JWTManager(app)

    def success(data):
        return {"status": "success", "data": data}

    def failure(reason):
        return {"status": "failure", "data": reason}

    @app.put("/users")
    def put_users():
        data = request.get_json()
        if "username" not in data or "password" not in data:
            return failure("missing username or password field")
        try:
            result = db.create_user(data["username"], data["password"])
        except:
            return failure("something went wrong")
        return success(dict(result))

    @app.get("/users/<id>")
    def get_users_id(id):
        result = db.get_user(id)
        return success(dict(result))

    @app.get("/users")
    def get_users():
        result = db.get_users()
        result = [dict(v) for v in result]
        return success(result)

    @app.post("/login")
    def login_user():
        data = request.get_json()
        if "username" not in data or "password" not in data:
            return failure("missing username or password field")
        result = db.login_user(data["username"], data["password"])
        if len(result) == 0:
            return failure(
                "incorrect username or password"
            )  # even though we know username not found
        elif result["match"] == False:
            return failure(
                "incorrect username or password"
            )  # even though we know password did not match
        token = create_access_token(identity=result["id"])
        return success(token)

    @app.delete("/users")
    @jwt_required()
    def delete_user():
        current_user_id = get_jwt_identity()
        result = db.delete_user(current_user_id)
        return success(dict(result))

    @app.put("/follows/<id>")
    @jwt_required()
    def follow_user():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        if "id" not in data:
            return failure('"id" parameter is required')
        result = db.follow_user(current_user_id, data["id"])
        return success(dict(result))

    @app.get("/follows")
    @jwt_required()
    def followed_users():
        current_user_id = get_jwt_identity()
        result = db.followed_users(current_user_id)
        result = [dict(v) for v in result]
        return success(result)

    @app.get("/followers")
    @jwt_required()
    def followers():
        current_user_id = get_jwt_identity()
        result = db.followers(current_user_id)
        result = [dict(v) for v in result]
        return success(result)

    @app.delete("/follows/<id>")
    @jwt_required()
    def unfollow_user(id):
        current_user_id = get_jwt_identity()
        result = db.unfollow_user(current_user_id, id)
        return success(dict(result))

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
