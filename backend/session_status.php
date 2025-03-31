<?php
session_start();

$response = array(
    "logged_in" => isset($_SESSION['username']) ? true : false
);

header('Content-Type: application/json');
echo json_encode($response);
exit;
?>
