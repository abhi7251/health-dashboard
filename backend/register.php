<?php

require '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $mobile = trim($_POST['mobile']);
    $password = trim($_POST['password']);

    if (empty($name) || empty($username) || empty($email)  || empty($password)) {
        die('All fields are required.');
    }

    $conn = new mysqli($host, $db_user, $db_pass, $dbname);

    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? OR email = ? OR mobile = ?");
    $stmt->bind_param('sss', $username, $email, $mobile);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        die('Username, email, or mobile number already exists. Please try a different one.');
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (name, username, email, mobile, password) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('sssss', $name, $username, $email, $mobile, $hashedPassword);

    if ($stmt->execute()) {
        echo 'Registration successful. You can now log in.';
    } else {
        echo 'Error: ' . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
