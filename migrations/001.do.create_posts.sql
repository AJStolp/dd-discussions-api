CREATE TABLE posts (
   id INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
   date_published TIMESTAMPTZ DEFAULT now() NOT NULL,
   title TEXT NOT NULL,
   body TEXT NOT NULL
);