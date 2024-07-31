# Backend Implementation and Design

## Application Program Interface (API)

- `{"status": "failure"}` will be in the format
`{"status": "failure", "data" : "reason for failure"}`
where relevant.
- All endpoints that need authorization (indicated by `[+]`) will
require a JWT token with the `Authorization: Bearer JWT-TOKEN` header.

<!-- TODO might need to return ID when created -->

| Endpoint | Purpose | Request | Response |
|----------|---------|---------|----------|
| `[+] PUT /users` | register a user | <code>{"username": "<>", "password": "<>"}</code> | <code>{"status": "success/failure"}</code> |
| `GET /users/:id` | view a user profile with id=:id | | <code>{"status": "success/failure", "data": {"username": "", "tweets": ["", ..., ]}}</code> |
| `POST /users` | login | <code>{"username": "<>", "password": "<>"}</code>| <code>{"status": "success/failure", "data": "jwt token"}</code> |
| `[+] PATCH /users` | update username and/or password | <code>{"username": "<>", "password": "<>"}</code> | <code>{"status": "success/failure"}</code>|
| `[+] DELETE /users` | delete a user | | <code>{ "status" : "success/failure" } </code> |
| `[+] PUT /follows/:id` | follow a user with id=:id | | <code>{"status": "success/failure"}</code> |
| `[+] GET /follows` | get followed users for current user| | <code>{"status": "success", "data": [user_id1, user_id2, ...]</code> |
| `[+] DELETE /follows/:id` | unfollow a user with id=:id | | <code>{"status": "success/failure"}</code> |
| `[+] PUT /tweets` | add a tweet for current user | <code>{"content": "<>"}</code> | <code>{"status": "success/failure"}</code> |
| `GET /tweets/:id` | read a tweet | | <code>{"status": "success/failure", data="content of the tweet"}</code> |
| `[+] PATCH /tweets/:id` | update a tweet | <code>{"content": "<>"}</code> | <code>{"status": "success/failure"}</code> |
| `[+] DELETE /tweets/:id` | delete a tweet | | <code>{"status": "success/failure"}</code> |
