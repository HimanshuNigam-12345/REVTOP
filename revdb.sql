-- Create the database
CREATE DATABASE IF NOT EXISTS revdb;

-- Use the created database
USE revdb;

-- Create the UserProfiles table
CREATE TABLE IF NOT EXISTS UserProfiles (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    JoinDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the GeneratedQuestions table
CREATE TABLE IF NOT EXISTS GeneratedQuestions (
    QuestionID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    QuestionText TEXT,
    GeneratedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES UserProfiles(UserID)
);

-- Create the QuestionTemplates table with a new column for custom templates
CREATE TABLE IF NOT EXISTS QuestionTemplates (
    TemplateID INT AUTO_INCREMENT PRIMARY KEY,
    TemplateName VARCHAR(100),
    TemplateText TEXT,
    CustomTemplate TEXT
);

-- Create the UserPreferences table
CREATE TABLE IF NOT EXISTS UserPreferences (
    UserID INT PRIMARY KEY,
    Theme VARCHAR(20),
    Language VARCHAR(20),
    FOREIGN KEY (UserID) REFERENCES UserProfiles(UserID)
);

-- Create the UsageAnalytics table
CREATE TABLE IF NOT EXISTS UsageAnalytics (
    AnalyticsID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Action VARCHAR(100),
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES UserProfiles(UserID)
);
