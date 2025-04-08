þ<?php
// Include database connection
require_once 'config.php';

// Set header to return JSON
header('Content-Type: application/json');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Only POST requests are allowed'
    ]);
    exit;
}

// Validate and sanitize input
if (empty($_POST['name']) || empty($_POST['image_url']) || empty($_POST['description'])) {
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required'
    ]);
    exit;
}

$name = sanitizeInput($_POST['name']);
$image_url = sanitizeInput($_POST['image_url']);
$description = sanitizeInput($_POST['description']);

// Prepare and execute SQL query
$stmt = $conn->prepare("INSERT INTO folders (name, image_url, description) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $image_url, $description);

if ($stmt->execute()) {
    // Get the ID of the newly created folder
    $new_id = $conn->insert_id;
    
    echo json_encode([
        'success' => true,
        'message' => 'Folder created successfully',
        'id' => $new_id
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error creating folder: ' . $stmt->error
    ]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
