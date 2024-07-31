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
