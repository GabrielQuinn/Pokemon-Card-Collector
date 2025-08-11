CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    user_name VARCHAR(70),
    user_pass VARCHAR(120),
    user_api VARCHAR(120),
    user_creation_date DATE,
    user_public INT DEFAULT 0,
    PRIMARY KEY (user_id)
);
CREATE TABLE connections (
    connection_id INT AUTO_INCREMENT,
    user1_id INT,
    user2_id INT,
    PRIMARY KEY (connection_id),
    FOREIGN KEY (user1_id) REFERENCES users(user_id),
    FOREIGN KEY (user2_id) REFERENCES users(user_id)
);
CREATE TABLE cards (
    card_id INT AUTO_INCREMENT,
    card_owner INT,
    card_api_id INT,
    card_name VARCHAR(100),
    PRIMARY KEY (card_id),
    FOREIGN KEY (card_owner) REFERENCES users(user_id)
);