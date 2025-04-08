<?php
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
if (empty($_POST['id']) || empty($_POST['name']) || empty($_POST['image_url']) || empty($_POST['description'])) {
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required'
    ]);
    exit;
}

$id = (int)$_POST['id'];
$name = sanitizeInput($_POST['name']);
$image_url = sanitizeInput($_POST['image_url']);
$description = sanitizeInput($_POST['description']);

// Prepare and execute SQL query
$stmt = $conn->prepare("UPDATE folders SET name = ?, image_url = ?, description = ? WHERE id = ?");
$stmt->bind_param("sssi", $name, $image_url, $description, $id);

if ($stmt->execute()) {
    // Check if any rows were affected
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Folder updated successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No folder found with the provided ID'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error updating folder: ' . $stmt->error
    ]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
