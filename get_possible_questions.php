<?php
header("Content-Type: application/json");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
    exit;
}

// Retrieve the request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate the input
if (!isset($data['content'], $data['difficulty'], $data['apiKey'])) {
    echo json_encode(["success" => false, "error" => "Missing required fields."]);
    exit;
}

$content = $data['content'];
$difficulty = $data['difficulty'];
$apiKey = $data['apiKey'];

// Call the AI API to get possible questions (Replace with actual API call)
$response = callAiApi($content, $difficulty, $apiKey);

if ($response === false) {
    echo json_encode(["success" => false, "error" => "Failed to get possible questions."]);
    exit;
}

// Output the response
echo json_encode(["success" => true, "questions" => $response]);

function callAiApi($content, $difficulty, $apiKey) {
    // Example API URL (Replace with actual API URL)
    $apiUrl = "https://api.example.com/get_questions";

    // Prepare the request payload
    $postData = json_encode([
        "content" => $content,
        "difficulty" => $difficulty,
        "apiKey" => $apiKey
    ]);

    // Initialize cURL
    $ch = curl_init($apiUrl);

    // Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($postData)
    ]);

    // Execute the request
    $result = curl_exec($ch);

    // Check for errors
    if (curl_errno($ch)) {
        curl_close($ch);
        return false;
    }

    // Close the cURL session
    curl_close($ch);

    // Decode the response
    $response = json_decode($result, true);

    // Check if the API returned an error
    if (!isset($response['questions'])) {
        return false;
    }

    return $response['questions'];
}
?>
