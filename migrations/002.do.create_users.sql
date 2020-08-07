CREATE TABLE users (
   id INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
   email TEXT NOT NULL UNIQUE,
   password TEXT NOT NULL,
   username TEXT NOT NULL,
   post_id INT REFERENCES posts(id) ON DELETE CASCADE
);