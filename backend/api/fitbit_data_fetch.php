<?php
//session_start();
require '../../config.php';
require 'token.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$username = $_SESSION['username'];

// Get access token
$result = $conn->query("SELECT access_token FROM fitbit_tokens WHERE username = '$username'");
if ($result->num_rows === 0) {
    echo json_encode(['error' => 'No token found']);
    exit;
}

$access_token = $result->fetch_assoc()['access_token'];
$access_token = refresh_token($username, $conn);

$valid = isTokenValid($access_token); 
if ($valid === null) { // Check if the token is valid
    echo json_encode(['error' => 'Invalid access token.']);
    exit;
}
else if($valid === false){
    if($access_token === false){
        echo json_encode(['error' => 'Failed to refresh token']);
        exit;
    }
}

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

$startDate = new DateTime('-30 days');
$endDate = new DateTime(); // today

$interval = new DateInterval('P1D');
$period = new DatePeriod($startDate, $interval, $endDate->modify('+1 day'));

// Fetch all 30 days of data first
$stepsData    = fetchFitbitData("https://api.fitbit.com/1/user/-/activities/steps/date/{$startDate->format('Y-m-d')}/{$endDate->format('Y-m-d')}.json", $access_token);
$caloriesData = fetchFitbitData("https://api.fitbit.com/1/user/-/activities/calories/date/{$startDate->format('Y-m-d')}/{$endDate->format('Y-m-d')}.json", $access_token);
$heartData    = fetchFitbitData("https://api.fitbit.com/1/user/-/activities/heart/date/{$startDate->format('Y-m-d')}/{$endDate->format('Y-m-d')}.json", $access_token);
$sleepData    = fetchFitbitData("https://api.fitbit.com/1.2/user/-/sleep/date/{$startDate->format('Y-m-d')}/{$endDate->format('Y-m-d')}.json", $access_token);
$waterData    = fetchFitbitData("https://api.fitbit.com/1/user/-/foods/log/water/date/{$startDate->format('Y-m-d')}/{$endDate->format('Y-m-d')}.json", $access_token);
$weightData   = fetchFitbitData("https://api.fitbit.com/1/user/-/body/log/weight/date/{$startDate->format('Y-m-d')}/{$endDate->format('Y-m-d')}.json", $access_token);

// Index data by date for quick lookup
function indexByDate($list, $key = 'dateTime') {
    $map = [];
    foreach ($list as $item) {
        $map[$item[$key]] = $item;
    }
    return $map;
}
$stepsMap    = indexByDate($stepsData['activities-steps'] ?? []);
$caloriesMap = indexByDate($caloriesData['activities-calories'] ?? []);
$heartMap    = indexByDate($heartData['activities-heart'] ?? []);



$sleepMap = [];
foreach ($sleepData['sleep'] ?? [] as $entry) {
    $date = $entry['dateOfSleep'];
    $sleepMap[$date] = ($sleepMap[$date] ?? 0) + ($entry['minutesAsleep'] ?? 0);
}

$waterMap = indexByDate($waterData['foods-log-water'] ?? []);
$weightMap = [];

//store previous weight if current weight is not available
$weightEntries = $weightData['weight'] ?? [];
$weightMap = [];

// Create a map of actual logged weights
$loggedWeights = [];
foreach ($weightEntries as $entry) {
    $loggedWeights[$entry['date']] = $entry['weight'];
}



// Fill weightMap with values for every date in the range
$prevWeight = null;
foreach ($period as $dateObj) {
    $date = $dateObj->format('Y-m-d');

    if (isset($loggedWeights[$date])) {
        $prevWeight = $loggedWeights[$date]; // Update prev weight
    }

    // Store previous weight if exists, or 0 if still unknown
    $weightMap[$date] = ['weight' => $prevWeight ?? 0];
}



// Prepare the insert/update statement
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

function estimate_heart_rate(int $weight, int $steps, float $sleep_hours, int $calories) {
    $base_hr = 60;
    $step_factor = 0.7;
    $calorie_factor = 0.4;
    $sleep_factor = 1.2;
    
    if($weight <= 0) {
       $weight = 65; // default weight in kg
    }
    
    $heart_rate = (
        $base_hr
        + $step_factor * ($steps / 1000)
        + $calorie_factor * ($calories / $weight)
        - $sleep_factor * $sleep_hours
    );
    
    return round($heart_rate, 2);
}

foreach ($period as $date) {
    $today = $date->format('Y-m-d');

    $steps = (int)($stepsMap[$today]['value'] ?? 0);
    $calories = (int)($caloriesMap[$today]['value'] ?? 0);
    $sleep = round(($sleepMap[$today] ?? 0) / 60, 1); // in hours
    $water = round(($waterMap[$today]['value'] ?? 0) / 1000, 2); // in liters
    $weight = isset($weightMap[$today]) ? round($weightMap[$today]['weight'], 1) : 0;
    
    $heartRate = estimate_heart_rate($weight, $steps, $sleep, $calories);
    if ($heartRate < 0) {
        $heartRate = 0; // Ensure heart rate is not negative
    }
    $stmt->bind_param("ssiiiddd", $username, $today, $steps, $calories, $heartRate, $sleep, $water, $weight);
    $stmt->execute();
}

// Clean up: Delete old records (before 30 days ago)
$cutoff = $startDate->format('Y-m-d');
$deleteStmt = $conn->prepare("DELETE FROM fitbit_data WHERE username = ? AND recorded_at < ?");
$deleteStmt->bind_param("ss", $username, $cutoff);
$deleteStmt->execute();

echo json_encode(['data' => 'successfully fetched and stored']);
?>
