    <?php
    // Database configuration
    $servername = "localhost";  // Typically "localhost"
    $username = "root";  // Your database username, default is "root" for XAMPP
    $password = "";  // Your database password, default is empty for XAMPP
    $dbname = "revdb";  // The name of your database

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Function to escape user inputs to prevent SQL Injection
    function escape_input($data) {
        global $conn;
        return mysqli_real_escape_string($conn, $data);
    }

    // Function to handle user registration
    function registerUser($username, $password, $firstname = '', $lastname = '') {
        global $conn;
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $username = escape_input($username);
        $firstname = escape_input($firstname);
        $lastname = escape_input($lastname);

        $sql = "INSERT INTO UserProfiles (Username, Password, FirstName, LastName)
                VALUES ('$username', '$hashed_password', '$firstname', '$lastname')";

        if ($conn->query($sql) === TRUE) {
            return ["success" => true, "message" => "Registration successful."];
        } else {
            return ["success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error];
        }
    }

    // Function to handle user login
    function loginUser($username, $password) {
        global $conn;
        $username = escape_input($username);
        $sql = "SELECT * FROM UserProfiles WHERE Username = '$username'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['Password'])) {
                return ["success" => true, "message" => "Login successful.", "user" => $user];
            } else {
                return ["success" => false, "message" => "Invalid password."];
            }
        } else {
            return ["success" => false, "message" => "No user found with that username."];
        }
    }

    // Function to save generated questions
    function saveGeneratedQuestion($userId, $questionText) {
        global $conn;
        $userId = escape_input($userId);
        $questionText = escape_input($questionText);

        $sql = "INSERT INTO GeneratedQuestions (UserID, QuestionText)
                VALUES ('$userId', '$questionText')";

        if ($conn->query($sql) === TRUE) {
            return ["success" => true, "message" => "Question saved successfully."];
        } else {
            return ["success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error];
        }
    }

    // Function to save custom templates
    function saveCustomTemplate($templateName, $templateText, $customTemplate) {
        global $conn;
        $templateName = escape_input($templateName);
        $templateText = escape_input($templateText);
        $customTemplate = escape_input($customTemplate);

        $sql = "INSERT INTO QuestionTemplates (TemplateName, TemplateText, CustomTemplate)
                VALUES ('$templateName', '$templateText', '$customTemplate')";

        if ($conn->query($sql) === TRUE) {
            return ["success" => true, "message" => "Template saved successfully."];
        } else {
            return ["success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error];
        }
    }

    ?>
