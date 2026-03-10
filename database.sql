
CREATE DATABASE IF NOT EXISTS skill_assessment;
USE skill_assessment;

CREATE TABLE instructors(
 id INT AUTO_INCREMENT PRIMARY KEY,
 username VARCHAR(50),
 password VARCHAR(50)
);

INSERT INTO instructors(username,password) VALUES('admin','admin');

CREATE TABLE assessments(
 id INT AUTO_INCREMENT PRIMARY KEY,
 data TEXT
);
