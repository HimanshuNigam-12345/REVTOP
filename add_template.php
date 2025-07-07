<?php
header("Content-Type: application/json");
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->templateName) || !isset($data->templateText) || !isset($data->customTemplate)) {
        echo json_encode(array("success" => false, "message" => "Missing required fields."));
        exit;
    }

    $templateName = $data->templateName;
    $templateText = $data->templateText;
    $customTemplate = $data->customTemplate;

    $stmt = $conn->prepare("INSERT INTO QuestionTemplates (TemplateName, TemplateText, CustomTemplate) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $templateName, $templateText, $customTemplate);

    if ($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Template added successfully."));
    } else {
        echo json_encode(array("success" => false, "message" => "Error adding template."));
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(array("success" => false, "message" => "Invalid request method."));
}
?>