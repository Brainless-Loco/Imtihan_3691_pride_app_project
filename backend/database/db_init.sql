CREATE DATABASE IF NOT EXISTS prideapp;

CREATE USER IF NOT EXISTS 'prideuser'@'%' IDENTIFIED BY 'pridepass';
GRANT ALL PRIVILEGES ON prideapp.* TO 'prideuser'@'%';
FLUSH PRIVILEGES;


USE prideapp;

CREATE TABLE IF NOT EXISTS users(
	id integer PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    security_question VARCHAR(255),
    security_answer VARCHAR(255),
    created TIMESTAMP NOT NULL DEFAULT NOW()
    
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,                    

    name VARCHAR(255),
    pronouns VARCHAR(50),
    account_type VARCHAR(100),
    role VARCHAR(100),
    company VARCHAR(255),
    experience VARCHAR(100),
    age TINYINT UNSIGNED,
    location VARCHAR(255),

    interests JSON,                           
    tags JSON,                                

    bio TEXT,                                 

    profile_pic LONGBLOB,                    
    profile_pic_mime VARCHAR(50),             
    profile_pic_etag CHAR(40),                
    profile_pic_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_user_profile (user_id),
    CONSTRAINT fk_user_profiles_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255),
  description TEXT,
  link VARCHAR(500),
  tags VARCHAR(255),
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);








