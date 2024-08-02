# Backend Implementation and Design

## Application Program Interface (API)

- `{"status": "failure"}` will be in the format
`{"status": "failure", "data" : "reason for failure"}`
where relevant.
- All endpoints that need authorization (indicated by `[+]`) will
require a JWT token with the `Authorization: Bearer JWT-TOKEN` header.

| Endpoint | Purpose | Request | Response |
|----------|---------|---------|----------|
| `[+] PUT /users` | register a user | <code>{"username": "<>", "password": "<>"}</code> | <code>{"status": "success/failure"}</code> |
| `GET /users/:id` | view a user profile with id=:id | | <code>{"status": "success/failure", "data": {"username": "", "tweets": ["", ..., ]}}</code> |
| `GET /users` | view a list of all users | | <code>{"status": "success/failure", "data": [{"id": "<>", "username": "<>"}]</code> |
| `POST /users` | login | <code>{"username": "<>", "password": "<>"}</code>| <code>{"status": "success/failure", "data": "jwt token"}</code> |
| `[+] PATCH /users` | update password | <code>{"password": "<>"}</code> | <code>{"status": "success/failure"}</code>|
| `[+] DELETE /users` | delete a user | | <code>{ "status" : "success/failure" } </code> |
| `[+] PUT /follows/:id` | follow a user with id=:id | | <code>{"status": "success/failure"}</code> |
| `[+] GET /follows` | get followed users for current user| | <code>{"status": "success/failure", "data": [user_id1, user_id2, ...]</code> |
| `[+] GET /followers` | get followers for current user| | <code>{"status": "success/failure", "data": [user_id1, user_id2, ...]</code> |
| `[+] DELETE /follows/:id` | unfollow a user with id=:id | | <code>{"status": "success/failure"}</code> |
| `[+] PUT /tweets` | add a tweet for current user | <code>{"content": "<>"}</code> | <code>{"status": "success/failure"}</code> |
| `GET /tweets/:id` | read a tweet | | <code>{"status": "success/failure", data="content of the tweet"}</code> |
| `GET /users/:id/tweets` |read all tweets from a user| | <code>{"status": "success/failure", data="content of the tweet"}</code> |
| `[+] PATCH /tweets/:id` | update a tweet | <code>{"content": "<>"}</code> | <code>{"status": "success/failure"}</code> |
| `[+] DELETE /tweets/:id` | delete a tweet | | <code>{"status": "success/failure"}</code> |

## Files

- `db.py` has python code to connect with and operate on the database.
The file also has some unit tests that can be run with `python db.py`
