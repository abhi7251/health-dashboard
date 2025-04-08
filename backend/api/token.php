<?php
require 'apiInfo.php';

function refresh_token($username, $conn){
    global $client_id, $client_secret;
    $refresh_token = $conn->query("SELECT refresh_token FROM fitbit_tokens WHERE username = '$username'");

    if (!$refresh_token) return false;

    $data = http_build_query([
        'grant_type' => 'refresh_token',
        'refresh_token' => $refresh_token,
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
    curl_close($ch);

    $result = json_decode($response, true);

    if (isset($result['access_token'])) {
        $new_access_token = $result['access_token'];
        $new_refresh_token = $result['refresh_token'];

        $stmt = $conn->prepare("UPDATE fitbit_tokens SET access_token = ?, refresh_token = ?, created_at = NOW() WHERE username = ?");
        $stmt->bind_param("sss", $new_access_token, $new_refresh_token, $username);
        $stmt->execute();
        $stmt->close();

        return $new_access_token;
    }

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
        echo 'Curl error: ' . curl_error($ch);
        return null;
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode == 401) {
        return false;
    }

    return true;

}
?>