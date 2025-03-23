<?php
$host = 'localhost';
$db_user = 'root';
$db_pass = '';  // Leave this empty if there's no password
$dbname = 'health_dashboard';

// Create connection
$conn = new mysqli($host, $db_user, $db_pass);

// Check connection
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) !== TRUE) {
    die('Error creating database: ' . $conn->error);
}

// Select the database
$conn->select_db($dbname);

// Create the users table if it doesn't exist
$tableSql = "CREATE TABLE IF NOT EXISTS users (
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    mobile VARCHAR(15) UNIQUE,
    password VARCHAR(255) NOT NULL
)";

if ($conn->query($tableSql) !== TRUE) {
    die('Error creating table: ' . $conn->error);
}

echo "Database and table setup completed successfully.";
$conn->close();
?>
