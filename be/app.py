from flask import Flask
from flask import request

from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

import db

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "FIXME-CHANGE-THIS"
jwt = JWTManager(app)

def success(data):
    return {
        'status': 'success',
        'data': data
    }

def failure(reason):
    return {
        'status': 'failure',
        'data': reason
    }

@app.put('/users')
def put_users():
    data = request.get_json()
    if 'username' not in data or 'password' not in data:
        return failure("missing username or password field")
    result = db.create_user(data['username'], data['password'])
    return success(dict(result))

@app.get('/users/<id>')
def get_users_id(id):
    result = db.get_user(id)
    return success(dict(result))

@app.get('/users')
def get_users():
    result = db.get_users()
    result = [dict(v) for v in result]
    return success(result)

@app.post('/login')
def login_user():
    data = request.get_json()
    if 'username' not in data or 'password' not in data:
        return failure('missing username or password field')
    result = db.login_user(data['username'], data['password'])
    if len(result) == 0:
        return failure("incorrect username or password") # even though we know username not found
    elif result['match'] == False:
        return failure('incorrect username or password') # even though we know password did not match
    token = create_access_token(identity=result['id'])
    return success(token)

@app.delete('/users')
@jwt_required()
def delete_user():
    current_user_id = get_jwt_identity()
    result = db.delete_user(current_user_id)
    return success(dict(result))


app.run(debug=True)
