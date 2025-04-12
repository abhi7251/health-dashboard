<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Start session only if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(604800, "/"); // Optional: Set cookie for 7 days
    session_start();
}

$host = 'localhost';
$db_user = 'root';
$db_pass = '';  // Leave blank if no password
$dbname = 'health_dashboard';

// Create connection to MySQL (without selecting DB first)
$conn = new mysqli($host, $db_user, $db_pass);

// Check initial connection
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS `$dbname`";
if (!$conn->query($sql)) {
    echo json_encode(['status' => 'error', 'message' => 'Error creating database: ' . $conn->error]);
    exit();
}

// Now select the database
$conn->select_db($dbname);

// Create users table if it doesn't exist
$userTable = "CREATE TABLE IF NOT EXISTS users (
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    mobile VARCHAR(15) UNIQUE,
    password VARCHAR(255) NOT NULL
)";

$logTable = "CREATE TABLE IF NOT EXISTS login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    login_time DATETIME NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
)";

$dataTable = "CREATE TABLE IF NOT EXISTS fitbit_data (
    username VARCHAR(255),
    recorded_at DATE,
    steps INT,
    calories INT,
    heartRate INT,
    water FLOAT,
    sleep FLOAT,
    weight FLOAT,
    PRIMARY KEY (username, recorded_at),
    FOREIGN KEY (username) REFERENCES fitbit_tokens(username) ON DELETE CASCADE
)";

$tokenTable = "CREATE TABLE IF NOT EXISTS fitbit_tokens (
    username VARCHAR(100) PRIMARY KEY,
    access_token TEXT,
    refresh_token TEXT,
    user_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
)";

if (!$conn->query($userTable)) {
    echo json_encode(['status' => 'error', 'message' => 'Error creating user table: ' . $conn->error]);
    exit();
}

if
(!$conn->query($logTable)) {
    echo json_encode(['status' => 'error', 'message' => 'Error creating log table: ' . $conn->error]);
    exit();
}

if
(!$conn->query($tokenTable)) {
    echo json_encode(['status' => 'error', 'message' => 'Error creating token table: ' . $conn->error]);
    exit();
}

if (!$conn->query($dataTable)) {
    echo json_encode(['status' => 'error', 'message' => 'Error creating data table: ' . $conn->error]);
    exit();
}


?>
