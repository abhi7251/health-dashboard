<?php
require '../config.php';

// Ensure response is JSON
header('Content-Type: application/json');

// Default response
$response = ["status" => "error", "message" => ""];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response["message"] = "Invalid request method.";
    echo json_encode($response);
    exit;
}

// Check if required fields exist
if (!isset($_POST['name'], $_POST['username'], $_POST['email'], $_POST['password'])) {
    $response["message"] = "All fields are required.";
    echo json_encode($response);
    exit;
}

$name = trim($_POST['name']);
$username = trim($_POST['username']);
$email = trim($_POST['email']);
$mobile = isset($_POST['mobile']) ? trim($_POST['mobile']) : null;
$password = trim($_POST['password']);

// Validate required fields
if (empty($name) || empty($username) || empty($email) || empty($password)) {
    $response["message"] = "All fields are required.";
    echo json_encode($response);
    exit;
}


// Check if username, email, or mobile exists
$stmt = $conn->prepare("SELECT 1 FROM users WHERE username = ? OR email = ? OR mobile = ?");
if (!$stmt) {
    $response["message"] = "Database error: " . $conn->error;
    echo json_encode($response);
    exit;
}

$stmt->bind_param('sss', $username, $email, $mobile);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $response["message"] = "Username, email, or mobile number already exists.";
    echo json_encode($response);
    exit;
}

$stmt->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (name, username, email, mobile, password) VALUES (?, ?, ?, ?, ?)");
if (!$stmt) {
    $response["message"] = "Query error: " . $conn->error;
    echo json_encode($response);
    exit;
}

$stmt->bind_param('sssss', $name, $username, $email, $mobile, $hashedPassword);
if ($stmt->execute()) {
    $response["status"] = "success";
    $response["message"] = "Registration successful!";
    $response["redirect"] = "login.html";
} else {
    $response["message"] = "Error: " . $stmt->error;
}

$stmt->close();


echo json_encode($response);
exit;
?>
