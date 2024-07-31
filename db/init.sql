DROP TABLE IF EXISTS tweets, follows, users ;

-- create the users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  UNIQUE(username)
);

CREATE table follows (
  followed BIGINT,
  follower BIGINT,
  PRIMARY KEY (followed, follower),
  FOREIGN KEY (followed) REFERENCES users(ID) ON DELETE CASCADE,
  FOREIGN KEY (follower) REFERENCES users(ID) ON DELETE CASCADE
);

CREATE table tweets (
  id BIGSERIAL PRIMARY KEY,
  content VARCHAR(250) NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- in the future if you need to change the schema,
-- you will need to use a bunch of alter table statements
-- at which point, using a database migrations manager
-- or nosql databases might make more sense
