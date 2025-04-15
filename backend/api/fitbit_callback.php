<?php
require '../../config.php';
require 'apiInfo.php';

$redirect_uri = "http://52.66.243.41/health-dashboard/backend/api/fitbit_callback.php"; 
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

        $checkStmt = $conn->prepare("SELECT username FROM fitbit_tokens WHERE user_id = ?");
        $checkStmt->bind_param("s", $user_id);
        $checkStmt->execute();
        $checkStmt->store_result();
        
        if ($checkStmt->num_rows > 0) {
            // Update tokens for the existing user_id
            $updateStmt = $conn->prepare("UPDATE fitbit_tokens SET access_token = ?, refresh_token = ? WHERE user_id = ?");
            $updateStmt->bind_param("sss", $access_token, $refresh_token, $user_id);
            $updateStmt->execute();
            $updateStmt->close();
            $_SESSION['linkError'] = "Account already linked.";
        }else{
            $stmt = $conn->prepare("REPLACE INTO fitbit_tokens (username, access_token, refresh_token, user_id) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $username, $access_token, $refresh_token, $user_id);
            $stmt->execute();
            $stmt->close();
        }
        
        header("Location: ../../frontend/index.php");
        $checkStmt->close();
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
