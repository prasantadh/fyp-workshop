INSERT INTO users (username, password) VALUES 
  ('user1', 'password1'),
  ('user2', 'password2'),
  ('user3', 'password3'),
  ('user4', 'password4')
;

INSERT INTO follows(follower, followed) VALUES 
  (1, 3),
  (1, 4),
  (2, 3),
  (3, 2);

INSERT INTO tweets(content, user_id, created_at) VALUES
  ('I am user1', 1, current_timestamp),
  ('I am user2', 2, current_timestamp),
  ('I am user3', 3, current_timestamp),
  ('I am user4', 4, current_timestamp);

-- You could use in general what is called a factory pattern
-- to generate fake data. fakerjs is an example.
-- When using javascript or python or other languages to
-- generate data it might be easier to use js classes
-- or python classes instead of SQL tables to represet data.
-- This is what Object Relational Mapping (ORM) are for:
-- to use programming language classes as SQL table.
-- ORM also ease other issues like data validation
-- Example: what if we want to validate the timestamp
-- to not be in the future or too into the past?
