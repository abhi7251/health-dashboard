<?php
require_once __DIR__ . '/../../config.php';

// Sample data (replace with database query later)
$data = [
    'dates' => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    'values' => [4500, 5200, 4800, 6000, 7100]
];

header('Content-Type: application/json');
echo json_encode($data);
?>