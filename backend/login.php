<?php
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


    function login_log($username, $conn) {
        date_default_timezone_set('Asia/Kolkata');
        $loginTime = date('Y-m-d H:i:s');

        // Get user IP address
        $ipAddress = $_SERVER['REMOTE_ADDR'];
        
        // Insert into login_logs table
        $stmt = $conn->prepare("INSERT INTO login_logs (username, login_time, ip_address) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $loginTime, $ipAddress);
        $stmt->execute();
        
        //limit to last 10 logs per user
        $cleanup = $conn->prepare("
            DELETE FROM login_logs
            WHERE username = ?
            AND id NOT IN (
                SELECT id FROM (
                    SELECT id FROM login_logs WHERE username = ? ORDER BY login_time DESC LIMIT 10
                ) AS temp
            )
        ");
        $cleanup->bind_param("ss", $username, $username);
        $cleanup->execute();
    }
    
    if (password_verify($password, $row['password'])) {
        $_SESSION['username'] = $username;
        login_log($username, $conn); // Log the login attempt
        echo json_encode(['status' => 'success', 'message' => 'Login successful. Welcome, ' . htmlspecialchars($username) . '!', 'redirect' => 'index.php']);
        exit(); 
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
        exit();
    }

    $stmt->close();

}
?>
