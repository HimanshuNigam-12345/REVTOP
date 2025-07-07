<?php
header("Content-Type: application/json");
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->userId) || !isset($data->theme) || !isset($data->language)) {
        echo json_encode(array("success" => false, "message" => "Missing required fields."));
        exit;
    }

    $userId = $data->userId;
    $theme = $data->theme;
    $language = $data->language;

    $stmt = $conn->prepare("REPLACE INTO UserPreferences (UserID, Theme, Language) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $userId, $theme, $language);

    if ($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Preferences updated successfully."));
    } else {
        echo json_encode(array("success" => false, "message" => "Error updating preferences."));
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(array("success" => false, "message" => "Invalid request method."));
}
?>
