<?php
// Include database connection
include 'db_connection.php';

// Retrieve JSON payload from the request
$data = json_decode(file_get_contents('php://input'), true);

// Extract variables from the request payload
$content = $data['content'];
$questionTypes = $data['questionTypes'];
$difficulty = $data['difficulty'];
$apiKey = $data['apiKey'];
$userId = isset($data['userId']) ? $data['userId'] : null;

// Check if all necessary data is present
if (empty($content) || empty($questionTypes) || empty($difficulty) || empty($apiKey)) {
    echo json_encode(['success' => false, 'error' => 'Missing required parameters']);
    exit;
}

// Function to generate questions (stub - replace with actual implementation)
function generateQuestions($content, $questionTypes, $difficulty, $apiKey) {
    // Example API request to a question generation service
    $apiUrl = "https://api.example.com/generate_questions"; // Replace with actual API URL
    $postData = json_encode([
        'content' => $content,
        'questionTypes' => $questionTypes,
        'difficulty' => $difficulty,
        'apiKey' => $apiKey
    ]);

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        error_log('Curl error: ' . curl_error($ch));
        return false;
    }

    $result = json_decode($response, true);
    curl_close($ch);

    if (isset($result['questions'])) {
        return $result['questions'];
    } else {
        error_log('API error: ' . json_encode($result));
        return false;
    }
}

// Generate questions
$generatedQuestions = generateQuestions($content, $questionTypes, $difficulty, $apiKey);

// Check if questions were generated
if ($generatedQuestions) {
    // Insert questions into the database if user is logged in
    if ($userId) {
        foreach ($generatedQuestions as $question) {
            $stmt = $conn->prepare("INSERT INTO questions (user_id, question_text) VALUES (?, ?)");
            $stmt->bind_param("is", $userId, $question);
            $stmt->execute();
        }
    }

    echo json_encode(['success' => true, 'questions' => $generatedQuestions]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to generate questions']);
}
?>
