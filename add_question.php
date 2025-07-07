<?php
header("Content-Type: application/json");
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->userId) || !isset($data->questionText)) {
        echo json_encode(array("success" => false, "message" => "Missing required fields."));
        exit;
    }

    $userId = $data->userId;
    $questionText = $data->questionText;

    $stmt = $conn->prepare("INSERT INTO GeneratedQuestions (UserID, QuestionText) VALUES (?, ?)");
    $stmt->bind_param("is", $userId, $questionText);

    if ($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Question added successfully."));
    } else {
        echo json_encode(array("success" => false, "message" => "Error adding question."));
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(array("success" => false, "message" => "Invalid request method."));
}
?>
