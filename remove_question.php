<?php
header("Content-Type: application/json");
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->questionId)) {
        echo json_encode(array("success" => false, "message" => "Missing required fields."));
        exit;
    }

    $questionId = $data->questionId;

    $stmt = $conn->prepare("DELETE FROM GeneratedQuestions WHERE QuestionID = ?");
    $stmt->bind_param("i", $questionId);

    if ($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Question removed successfully."));
    } else {
        echo json_encode(array("success" => false, "message" => "Error removing question."));
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(array("success" => false, "message" => "Invalid request method."));
}
?>
