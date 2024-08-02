from flask import Flask
import db

app = Flask(__name__)

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

@app.get('/users/<id>')
def get_users_id(id):
    result = db.get_user(id)
    return success(dict(result))

@app.get('/users')
def get_users():
    result = db.get_users()
    result = [dict(v) for v in result]
    return success(result)


app.run(debug=True)
