<?php
//session_start(); // Required to access session variables

require '../config.php';

$client_id = "23QD7Q"; // Replace with your actual client ID
$client_secret = "f335033977cd67377b0984d26a58da91"; // Replace with your actual client secret
$redirect_uri = "http://localhost/health-dashboard/frontend/fitbit_callback.php";

// Check if code is returned in the callback
if (isset($_GET['code'])) {
    $code = $_GET['code'];

    $data = http_build_query([
        'client_id' => $client_id,
        'grant_type' => 'authorization_code',
        'redirect_uri' => $redirect_uri,
        'code' => $code
    ]);

    $headers = [
        "Authorization: Basic " . base64_encode("$client_id:$client_secret"),
        "Content-Type: application/x-www-form-urlencoded"
    ];

    $ch = curl_init("https://api.fitbit.com/oauth2/token");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo "Curl Error: " . curl_error($ch);
        exit;
    }

    curl_close($ch);

    $result = json_decode($response, true);

    if (isset($result['access_token'])) {
        $access_token = $result['access_token'];
        $refresh_token = $result['refresh_token'];
        $user_id = $result['user_id'];
        
        if (!isset($_SESSION['username'])) {
            echo "Session expired. Please log in again.";
            exit;
        }

        $username = $_SESSION['username'];

        // Create table if it doesn't exist
        $conn->query("CREATE TABLE IF NOT EXISTS fitbit_tokens (
            username VARCHAR(100) PRIMARY KEY,
            access_token TEXT,
            refresh_token TEXT,
            user_id VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $stmt = $conn->prepare("REPLACE INTO fitbit_tokens (username, access_token, refresh_token, user_id) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $username, $access_token, $refresh_token, $user_id);
        $stmt->execute();

        // Redirect to a data display or dashboard
        // Redirect back to main dashboard (single-page app)
        header("Location: index.php?linked=1");
        exit();

    } else {
        echo "<h4>Error: Failed to retrieve token</h4>";
        echo "<pre>";
        print_r($result);
        echo "</pre>";
    }
} else {
    echo "Authorization code not received.";
}
?>
