<?php
require '../../config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$username = $_SESSION['username'];
$today = date('Y-m-d');

$stmt = $conn->prepare("SELECT * FROM fitbit_data WHERE username = ? AND recorded_at = ?");
$stmt->bind_param("ss", $username, $today);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['error' => 'No data found']);
    exit;
}

$data = $result->fetch_assoc();
$steps = (int)($data['steps'] ?? 0);
$calories = (int)($data['calories'] ?? 0);
$heartRate = (int)($data['heart_rate'] ?? 0);
$sleep = (float)($data['sleep'] ?? 0);
$water = (float)($data['water'] ?? 0);
$weight = (float)($data['weight'] ?? 0);


// Return the data as JSON
echo json_encode([
    'steps' => $steps,
    'calories' => $calories,
    'heartRate' => $heartRate,
    'sleep' => $sleep,
    'water' => $water,
    'weight' => $weight
]);
?>