<?php
require '../../config.php';
header('Content-Type: application/json');

$username = $_SESSION['username'] ?? '';
if (!$username) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}


$metric = $_GET['metric'] ?? 'steps';
$range = $_GET['range'] ?? 'weekly';

$validMetrics = ['steps', 'calories', 'heartRate', 'water', 'sleep', 'weight'];
if (!in_array($metric, $validMetrics)) {
    echo json_encode(["error" => "Invalid metric"]);
    exit;
}

// Define date range
$days = ($range === 'monthly') ? 30 : 7;
$endDate = date('Y-m-d');
$startDate = date('Y-m-d', strtotime("-$days days"));

// Fetch data
$sql = "SELECT recorded_at, $metric FROM fitbit_data 
        WHERE username = ? AND recorded_at BETWEEN ? AND ?
        ORDER BY recorded_at ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $username, $startDate, $endDate);
$stmt->execute();
$result = $stmt->get_result();

$labels = [];
$values = [];

while ($row = $result->fetch_assoc()) {
    $labels[] = date('j/n', strtotime($row['recorded_at']));
    $values[] = (float) $row[$metric];
}

echo json_encode([
    "labels" => $labels,
    "values" => $values
]);

$stmt->close();

