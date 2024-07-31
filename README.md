# fyp-workshop [IN PROGRESS]

Code for Final Year Project(FYP) workshop at Informatics College Pokhara(ICP)

## Features

The repo will implement a mini-twitter. The first iteration will

- allow users to have a username and a password
- allow users to signup, signin, delete account
- allow users to change password
- allow users to create, read, update, delete 250 chars tweets
- allow users to have a profile with all of their past tweets
- allow users to follow other users, view who they are following and
who follows them
- allow users to have a feed on the homepage from all the users followed

## Goals

The goals of the repo is to be

- Simple
  - Do we need a database? Yes.
  - Do we need an ORM? May be not. Once you know working with databases,
  an ORM will help. Full-stack frameworks will often manage migrations for you too.
  They often also help generate fake data for testing.
  However, these are conveniences once you know what you are doing--not necessarily
  the best entry tools.
  - In essence, if there is a simpler solution available to achieve our goals,
  we prefer that.
- Complete
  - Do we need version control? Yes. Moreover, we use github issues to track
  project features and completeness.
  - Do we need tests? Yes.
  - Do we need to support every feature we set out to support? Yes.
  - Effectively, we intend to hit every criteria that an FYP is expected to
  use and implement.

## Installation and Usage

We provide a docker compose to tie together the database, the backend and the frontend.

While it is not currently implemented, we intend the following command
to get the project up and running:

```bash
docker compose up
```

## A note to the maintainers

Please have a descriptive git commit as well as provide an overview of individual
component inside associated `README.md`. It is expected that the students will study
the code and the git history before attending the workshop.
