<?php
session_start();
require '../config.php';

header('Content-Type: application/json'); // JSON response

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username)){
        echo json_encode(['status' => 'error', 'message' => 'Please provide username.']);
        exit(); 
    }
    
    
    if(empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Please provide password.']);
        exit(); 
    }
    

    $conn = new mysqli($host, $db_user, $db_pass, $dbname);

    if ($conn->connect_error) {
        echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]);
        exit();
    }

    $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Query failed: ' . $conn->error]);
        exit();
    }

    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
        exit();
    }

    $row = $result->fetch_assoc();

    if (password_verify($password, $row['password'])) {
        $_SESSION['username'] = $username;
        echo json_encode(['status' => 'success', 'message' => 'Login successful. Welcome, ' . htmlspecialchars($username) . '!', 'redirect' => 'index.html']);
        exit(); 
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
        exit();
    }

    $stmt->close();
    $conn->close();
}
?>
