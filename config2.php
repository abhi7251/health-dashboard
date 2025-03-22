<?php
/***************************************
 * config.php - Core Configuration File
 ***************************************/

// ====================
// 1. Path Configuration
// ====================
// Define absolute path to project root (Windows-friendly)
define('BASE_PATH', $_SERVER['DOCUMENT_ROOT'] . '/Health-dashboard/');

// ====================
// 2. Database Settings
// ====================
define('DB_HOST', 'localhost');     // XAMPP default
define('DB_NAME', 'health_dashboard');
define('DB_USER', 'root');          // XAMPP default username
define('DB_PASS', '');              // XAMPP default password (empty)

// ====================
// 3. Error Reporting
// ====================
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ====================
// 4. API Credentials
// ====================
// Fitbit API (replace with your actual credentials)
define('FITBIT_CLIENT_ID', 'YOUR_CLIENT_ID_HERE');
define('FITBIT_CLIENT_SECRET', 'YOUR_CLIENT_SECRET_HERE');
define('FITBIT_REDIRECT_URI', 'http://localhost/Health-dashboard/callback.php');

// ====================
// 5. Security Settings
// ====================
// Prevent session hijacking
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1); // Enable if using HTTPS
ini_set('session.use_strict_mode', 1);

// ====================
// 6. Database Connection
// ====================
function db_connect() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
        return $conn;
    } catch (Exception $e) {
        error_log("Database error: " . $e->getMessage());
        die("Database connection error. Please try again later.");
    }
}

// ====================
// 7. Session Management
// ====================
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ====================
// 8. Security Headers
// ====================
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Content-Security-Policy: default-src 'self'");

// ====================
// 9. Timezone Setting
// ====================
date_default_timezone_set('UTC');

// ====================
// 10. File Includes
// ====================
require_once BASE_PATH . 'backend/database/db_functions.php';
require_once BASE_PATH . 'backend/auth/auth_functions.php';
?>