<?php
require_once __DIR__ . '/../../config.php';

$data = [
    'values' => [3.5, 4.2, 1.8, 0.5] // Hours
];

header('Content-Type: application/json');
echo json_encode($data);
?>