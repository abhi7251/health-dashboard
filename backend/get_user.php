<?php
session_start();
require '../config.php';

// Send JSON response
header('Content-Type: application/json');

$response = ["status" => "error", "message" => "User not logged in."];

// Check if user is logged in
if (!isset($_SESSION['username'])) {
    echo json_encode($response);
    exit;
}

$userId = $_SESSION['username'];

// Fetch user data
$stmt = $conn->prepare("SELECT name, username, email FROM users WHERE username = ?");
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    echo json_encode([
        "status" => "success",
        "name" => $user['name'],
        "username" => $user['username'],
        "email" => $user['email']
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "User not found."]);
}

$stmt->close();
?>
