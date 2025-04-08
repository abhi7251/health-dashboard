<?php

require '../../config.php';
require 'apiInfo.php';
require 'getToken.php';


$username = $_SESSION['username'];

if (!$username) {
    echo json_encode(['error' => 'Session expired. Please log in again.']);
    exit;
}
$result = $conn->query("SELECT access_token FROM fitbit_tokens WHERE username = '$username'");
if ($result->num_rows === 0) {
    echo json_encode(['error' => 'No token found']);
    exit;
}

$access_token = $result->fetch_assoc()['access_token'];

$headers = [
    "Authorization: Basic " . base64_encode("$client_id:$client_secret"),
    "Content-Type: application/x-www-form-urlencoded"
];

$ch = curl_init("https://api.fitbit.com/oauth2/revoke");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, "token=" . urlencode($access_token));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode == 200) {
    $conn->query("DELETE FROM fitbit_tokens WHERE username = '$username'");
    $conn->query("DELETE FROM fitbit_data WHERE username = '$username'");

    echo json_encode(['success' => 'Token revoked and deleted successfully']);
} else {
    echo json_encode(['error' => 'Failed to revoke token']);
}


?>
