<?php
require '../../config.php';

$username = $_SESSION['username']; // or however you're managing login

if (!$username) {
    echo json_encode(['linked' => false, 'message' => 'User not logged in']);
    exit;
}

$stmt = $conn->prepare("SELECT access_token FROM fitbit_tokens WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (!empty($row['access_token'])) {
        echo json_encode(['linked' => true]);
    } else {
        echo json_encode(['linked' => false]);
    }
} 
else {
    echo json_encode(['linked' => false]);
}
$stmt->close();
?>
