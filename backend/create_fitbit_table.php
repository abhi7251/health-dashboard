<?php
require '../config.php'; // Adjust path if needed

$sql = "CREATE TABLE IF NOT EXISTS fitbit_data (
    username VARCHAR(255),
    recorded_at DATE,
    steps INT,
    calories INT,
    heartRate INT,
    water FLOAT,
    sleep FLOAT,
    weight FLOAT,
    PRIMARY KEY (username, recorded_at)
)";

if ($conn->query($sql) === TRUE) {
    echo "Table 'fitbit_data' created successfully!";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();
?>
