<?php
session_start();
header('Content-Type: application/json');

// DB connection
$host = "localhost";
$user = "root";
$password = "";
$db = "health_dashboard";

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$username = $_SESSION['username'] ?? '';
if (!$username) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

// Get metric and range from query
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
$sql = "SELECT recorded_date, $metric FROM fitbit_data 
        WHERE username = ? AND recorded_date BETWEEN ? AND ?
        ORDER BY recorded_date ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $username, $startDate, $endDate);
$stmt->execute();
$result = $stmt->get_result();

$labels = [];
$values = [];

while ($row = $result->fetch_assoc()) {
    $labels[] = date('D', strtotime($row['recorded_date']));  // e.g., Mon, Tue...
    $values[] = (float) $row[$metric];
}

echo json_encode([
    "labels" => $labels,
    "values" => $values
]);

$stmt->close();
$conn->close();
