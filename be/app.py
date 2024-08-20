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


    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response


    @app.put("/users")
    #issue: register a user with empty username and password (solved)
    def put_users():
        data = request.get_json()
        if "username" not in data or not data["username"].strip() or "password" not in data or not data["password"].strip():
            return failure("missing username or password field")
        try:
            result = db.create_user(data["username"], data["password"])
        except:
            return failure("something went wrong")
        return success(dict(result))      
    

    @app.get("/users/<id>")
    #issue: gives success message even if the user is not registered (solved)
    def get_users_id(id):
        result = db.get_user(id)
        if len(result) == 0:
            return failure("user not found")  
        else:
            return success(dict(result))

    @app.get("/users")
    #issue: success message even if there are no users (solved)
    def get_users():
        result = db.get_users()
        if len(result) == 0:
            return failure("users not registered")
        else:
            result = [dict(v) for v in result]
            return success(result)

    @app.post("/users")
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
        token = create_access_token(identity = result["id"])
        return success(token)

    @app.delete("/users")
    @jwt_required()
    def delete_user():
        current_user_id = get_jwt_identity()
        result = db.delete_user(current_user_id)
        return success(dict(result))

    @app.put("/follows/<id>")
    @jwt_required()
    #issue: tried to follow non-existing user
    def follow_user(id):
        current_user_id = get_jwt_identity()
        result = db.follow_user(current_user_id, id)
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

    @app.put("/tweets")
    @jwt_required()
    #issue: can put empty tweets (solved)
    def create_tweet():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        if "content" not in data or not data["content"].strip():
            return failure('missing "content" field')
        result = db.create_tweet(current_user_id, data["content"])
        return success(dict(result))

    @app.get("/tweets/<id>")
    def get_tweet(id):
        # FIXME id can be anything and this will crash (done)
        # Have a try...except block to return failure 
        # Same goes for get_tweets
        result = db.get_tweet(id)
        if len(result) == 0:
            return failure("tweet not found")
        return success(dict(result))

    @app.get("/users/<id>/tweets")
    def get_tweets(id):
        result = db.get_tweets(id)
        if len(result) == 0:
            return failure("no tweets found")
        result = [dict(v) for v in result]
        return success(result)

    @app.patch("/tweets/<id>")
    @jwt_required()
    def update_tweet(id):
        current_user_id = get_jwt_identity()
        # FIXME validate the current_user_id is tweet.user_id (done using query)
        # otherwise any authenticated user can edit any tweet (done)
        data = request.get_json()
        if "content" not in data or not data["content"].strip():
            return failure('missing "content" field')
        result = db.update_tweet(current_user_id, id, data["content"])
        if len(result) == 0:
            return failure("cannot update from other account")
        else:
            return success(dict(result))

    @app.delete("/tweets/<id>")
    @jwt_required()
    def delete_tweet(id):
        current_user_id = get_jwt_identity()
        # FIXME validate the current_user_id is tweet.user_id (done using query)
        # otherwise any authenticated user can delete any tweet (done)
        try:
            result = db.delete_tweet(current_user_id, id) 
            if len(result) == 0:
                return failure("cannot delete the tweet from other account")
            else:
                return success(dict(result))
        except Exception as e:
            return failure(f"Error: {str (e)}")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
