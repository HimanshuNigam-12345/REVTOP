<?php
header("Content-Type: application/json");
include 'config.php';

// Check if request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get JSON content from request body
    $data = json_decode(file_get_contents("php://input"));

    // Check if required fields are present
    if (!isset($data->username) || !isset($data->password)) {
        echo json_encode(array("success" => false, "message" => "Username and password are required."));
        exit;
    }

    // Extract username and password from JSON data
    $username = $data->username;
    $password = $data->password;

    // Authenticate user from the database
    $response = loginUser($username, $password);
    echo json_encode($response);
} else {
    echo json_encode(array("success" => false, "message" => "Invalid request method."));
}
?>
