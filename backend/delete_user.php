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

//delete user account
$userId = $_SESSION['username'];

$stmt = $conn->prepare("DELETE FROM users WHERE username = ?");
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $userId);
$stmt->execute();
$stmt->close();

session_unset();
session_destroy();

echo json_encode(["status" => "success", "message" => "User deleted successfully."]);


?>
