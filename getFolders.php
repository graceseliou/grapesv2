<?php
// Include database connection
require_once 'config.php';

// Set header to return JSON
header('Content-Type: application/json');

// Query to get all folders
$sql = "SELECT id, name, image_url, description, created_at, updated_at FROM folders ORDER BY created_at DESC";
$result = $conn->query($sql);

// Check if query was successful
if (!$result) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching folders: ' . $conn->error
    ]);
    exit;
}

// Fetch all folders as an associative array
$folders = [];
while ($row = $result->fetch_assoc()) {
    $folders[] = $row;
}

// Return folders as JSON - always return an array even if empty
echo json_encode($folders);

// Close connection
$conn->close();
?>
