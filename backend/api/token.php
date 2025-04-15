<?php
require 'apiInfo.php';

function refresh_token($username, $conn){
    global $client_id, $client_secret;

    // Securely fetch refresh token
    $stmt = $conn->prepare("SELECT refresh_token FROM fitbit_tokens WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if (!$result || $result->num_rows === 0) {
        error_log("No refresh token found for user: $username");
        return false;
    }

    $refresh_token = $result->fetch_assoc()['refresh_token'];

    $data = http_build_query([
        'grant_type' => 'refresh_token',
        'refresh_token' => $refresh_token
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
        error_log('Curl error during token refresh: ' . curl_error($ch));
        curl_close($ch);
        return false;
    }

    curl_close($ch);
    $result = json_decode($response, true);

    if (isset($result['access_token']) && isset($result['refresh_token'])) {
        $new_access_token = $result['access_token'];
        $new_refresh_token = $result['refresh_token'];

        $stmt = $conn->prepare("UPDATE fitbit_tokens SET access_token = ?, refresh_token = ?, created_at = NOW() WHERE username = ?");
        $stmt->bind_param("sss", $new_access_token, $new_refresh_token, $username);
        $stmt->execute();
        $stmt->close();

        return $new_access_token;
    }

    error_log("Failed to refresh token for $username. Response: $response");
    return false;
}


function isTokenValid($access_token) {
    $url = "https://api.fitbit.com/1/user/-/profile.json";
    $headers = [
        "Authorization: Bearer $access_token"
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        error_log("cURL Error in isTokenValid: $error_msg");
        curl_close($ch);
        return null;
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    error_log("✅ isTokenValid HTTP $httpCode | Response: $response");

    return $httpCode === 200;
}



?>