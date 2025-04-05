<?php
require '../config.php';

header('Content-Type: application/json'); 


// Define allowed fields
$allowed_fields = ["username", "email", "mobile"];
$field = "";
$value = "";

// Identify the field and value
foreach ($allowed_fields as $key) {
    if (!empty($_POST[$key])) {
        $field = $key;
        $value = trim($_POST[$key]);
        break; // Stop after finding the first valid field
    }
}

// Validate if a valid field was found
if ($field && $value) {
    // Prepare SQL query using the validated field name
    $stmt = $conn->prepare("SELECT 1 FROM users WHERE " . $field . " = ?");
    if ($stmt) {
        $stmt->bind_param('s', $value);
        $stmt->execute();
        $result = $stmt->get_result();

        // Return JSON response
        if ($result->num_rows > 0) {
            echo json_encode(["status" => "taken", "message" => ucfirst($field) . " is already taken."]);
        } 
        else {
            echo json_encode(["status" => "available", "message" => ucfirst($field) . " is  available."]);
        }

        $stmt->close();
    }
    else {
        echo json_encode(["status" => "error", "message" => "Query preparation failed"]);
    } 
}

else {
    echo json_encode(["status" => "error", "message" => "No valid field provided"]);
}

?>
