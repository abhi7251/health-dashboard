<?php
//session_start();
require '../../config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$username = $_SESSION['username'];
$today = date('Y-m-d');

// Get access token
$result = $conn->query("SELECT access_token FROM fitbit_tokens WHERE username = '$username'");
if ($result->num_rows === 0) {
    echo json_encode(['error' => 'No token found']);
    exit;
}

$access_token = $result->fetch_assoc()['access_token'];

// Helper function
function fetchFitbitData($url, $access_token) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $access_token"
    ]);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// 1. Steps
$stepsData = fetchFitbitData("https://api.fitbit.com/1/user/-/activities/steps/date/$today/1d.json", $access_token);
$steps = (int)($stepsData['activities-steps'][0]['value'] ?? 0);

// 2. Calories
$summaryData = fetchFitbitData("https://api.fitbit.com/1/user/-/activities/date/$today.json", $access_token);
$calories = (int)($summaryData['summary']['caloriesOut'] ?? 0);

// 3. Heart Rate (resting)
// $heartData = fetchFitbitData("https://api.fitbit.com/1/user/-/activities/heart/date/$today/1d.json", $access_token);
// $heartRate = (int)($heartData['activities-heart'][0]['value']['restingHeartRate'] ?? 0);
$heartRate = 78;

// 4. Sleep (in hours)
$sleepData = fetchFitbitData("https://api.fitbit.com/1.2/user/-/sleep/date/$today.json", $access_token);
$totalMinutesAsleep = $sleepData['summary']['totalMinutesAsleep'] ?? 0;
$sleep = round($totalMinutesAsleep / 60, 1);

// 5. Water (in liters)
$waterData = fetchFitbitData("https://api.fitbit.com/1/user/-/foods/log/water/date/$today.json", $access_token);
$water = round(($waterData['summary']['water'] ?? 0) / 1000, 2); // mL to L

// 6. Weight (kg)
$weightData = fetchFitbitData("https://api.fitbit.com/1/user/-/body/log/weight/date/$today.json", $access_token);
$weight = $weightData['weight'][0]['weight'] ?? 0;
$weight = $weight ? round($weight, 1) : 0;
$weight = $weight + 68;

// Insert or Update in DB
$stmt = $conn->prepare("
    INSERT INTO fitbit_data (username, recorded_at, steps, calories, heartRate, sleep, water, weight)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        steps = VALUES(steps),
        calories = VALUES(calories),
        heartRate = VALUES(heartRate),
        sleep = VALUES(sleep),
        water = VALUES(water),
        weight = VALUES(weight)
");
$stmt->bind_param("ssiiiddd", $username, $today, $steps, $calories, $heartRate, $sleep, $water, $weight);
$stmt->execute();
$stmt->close();

echo json_encode(['data' => 'successfully fetched and stored']);
?>
