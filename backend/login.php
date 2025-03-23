<?php

require '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($password)) {
        die('Both fields are required.');
    }

    $conn = new mysqli($host, $db_user, $db_pass, $dbname);

    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        die('Invalid username or password.');
    }

    $row = $result->fetch_assoc();

    if (password_verify($password, $row['password'])) {
        echo 'Login successful. Welcome, ' . htmlspecialchars($username) . '!';
    } else {
        echo 'Invalid username or password.';
    }

    $stmt->close();
    $conn->close();
}
?>
