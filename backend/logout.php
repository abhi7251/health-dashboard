<?php
require_once '../config.php'; 
header('Content-Type: application/json');

if (isset($_SESSION['username'])) {
    // If the user is logged in, destroy session
    session_unset();
    session_destroy();

    $response = array(
        "status" => "success",
        "message" => "Logged out successfully.",
        "redirect" => "login.html"
    );
} else {
    // If the user is not logged in
    $response = array(
        "status" => "error",
        "message" => "You are not logged in."
    );
}

echo json_encode($response);
exit;
?>
