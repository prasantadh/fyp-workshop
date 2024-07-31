# The Database Design and Implementation

## Business Rules

- A user has a username, and a password, and many tweets
- A tweet has a content (250 characters, text only) and
a timestamp for when it was created
- A followed (user) can have many followers
- A follower (user) can follow many followed (users)
- A user can have many tweets
- A tweet can belong to only one user

## ERD

The following ERD allows us to support all the features we
want.

![ERD](erd.svg)

## SQL Schema Code

The code for postgresql is available at `init.sql`
in the current folder.

```bash
psql postgres -c "create database twitter";
# to create the schema 
psql twitter -f init.sql;
# or to create the schema as well as seed the database
psql twitter -f init.sql -f seed.sql
```
