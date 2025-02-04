<?php
require_once __DIR__ . '/../../config.php';

$data = [
    'dates' => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    'values' => [72, 68, 75, 80, 65]
];

header('Content-Type: application/json');
echo json_encode($data);
?>