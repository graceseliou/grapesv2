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

// Validate input
if (empty($_POST['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Folder ID is required'
    ]);
    exit;
}

$id = (int)$_POST['id'];

// Prepare and execute SQL query
$stmt = $conn->prepare("DELETE FROM folders WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    // Check if any rows were affected
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Folder deleted successfully'
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
        'message' => 'Error deleting folder: ' . $stmt->error
    ]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
