<?php
require '../config.php';
header('Content-Type: application/json');

$response = array(
    "logged_in" => isset($_SESSION['username']) ? true : false
);

echo json_encode($response);
exit;
?>
