<?php


require '../config.php';

// Check if user is logged in
if (!isset($_SESSION['username'])) {
    echo "You must be logged in to access Fitbit data.";
    exit;
}

$username = $_SESSION['username'];

// Fetch access token from database
$stmt = $conn->prepare("SELECT access_token FROM fitbit_tokens WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "Fitbit not linked for this user.";
    exit;
}

$row = $result->fetch_assoc();
$access_token = $row['access_token'];

// Call Fitbit API for heart rate data
$ch = curl_init("https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo "cURL error: " . curl_error($ch);
    curl_close($ch);
    exit;
}

curl_close($ch);

// Decode and print data
$data = json_decode($response, true);
if (!isset($data['activities-heart'][0]['value'])) {
    die("Fitbit data not available");
}

// Step 2: Store in database
$username = $_SESSION['username']; // make sure user is logged in
$value = $data['activities-heart'][0]['value'];

$zones = $value['heartRateZones'];
$outOfRange = $zones[0];
$fatBurn = $zones[1];
$cardio = $zones[2];
$peak = $zones[3];

// Insert into DB
$sql = "INSERT INTO heart_rate_data (username, date, out_of_range_min, out_of_range_max, fat_burn_min, fat_burn_max, cardio_min, cardio_max, peak_min, peak_max)
        VALUES (?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        out_of_range_min = VALUES(out_of_range_min),
        out_of_range_max = VALUES(out_of_range_max),
        fat_burn_min = VALUES(fat_burn_min),
        fat_burn_max = VALUES(fat_burn_max),
        cardio_min = VALUES(cardio_min),
        cardio_max = VALUES(cardio_max),
        peak_min = VALUES(peak_min),
        peak_max = VALUES(peak_max)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("siiiiiiii", $username, 
    $outOfRange['min'], $outOfRange['max'],
    $fatBurn['min'], $fatBurn['max'],
    $cardio['min'], $cardio['max'],
    $peak['min'], $peak['max']
);
$stmt->execute();
$stmt->close();
$conn->close();

echo "<h3>Heart Rate Data (Today)</h3>";
echo "<pre>";
print_r($data);
echo "</pre>";

// Redirect to dashboard after successful data sync
header("Location: index.php");
exit();

