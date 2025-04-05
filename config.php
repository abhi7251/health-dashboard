<?php

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(604800, "/");
}
session_start();

$host = 'localhost';
$db_user = 'root';
$db_pass = '';  // Leave this empty if there's no password
$dbname = 'health_dashboard';

$response = []; // Array to store response messages

// Create connection
$conn = new mysqli($host, $db_user, $db_pass);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if (!$conn->query($sql)) {
    echo json_encode(['status' => 'error', 'message' => 'Error creating database: ' . $conn->error]);
    exit();
}

$response[] = 'Database check complete.';

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

if (!$conn->query($tableSql)) {
    echo json_encode(['status' => 'error', 'message' => 'Error creating table: ' . $conn->error]);
    exit();
}


?>
