<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "Password123!";
$dbname = "spotify_folders";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Return JSON response with error
    header('Content-Type: application/json');
    die(json_encode([
        'success' => false,
        'message' => 'Connection failed: ' . $conn->connect_error
    ]));
}

// Set character set
$conn->set_charset("utf8mb4");

// Function to sanitize user input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>
