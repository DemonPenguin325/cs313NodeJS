CREATE TABLE users (
    users_id       SERIAL PRIMARY KEY,
    username       VARCHAR(30),
    user_password   TEXT
);

INSERT INTO users (username, user_password) VALUES ('admin', 'password');