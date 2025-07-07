<?php
header("Content-Type: application/json");
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->templateId)) {
        echo json_encode(array("success" => false, "message" => "Missing required fields."));
        exit;
    }

    $templateId = $data->templateId;

    $stmt = $conn->prepare("DELETE FROM QuestionTemplates WHERE TemplateID = ?");
    $stmt->bind_param("i", $templateId);

    if ($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Template removed successfully."));
    } else {
        echo json_encode(array("success" => false, "message" => "Error removing template."));
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(array("success" => false, "message" => "Invalid request method."));
}
?>
