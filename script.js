document.addEventListener("DOMContentLoaded", () => {
  const inputTypeSelect = document.getElementById("input-type");
  const textInput = document.getElementById("text-input");
  const urlInput = document.getElementById("url-input");
  const documentUpload = document.getElementById("document-upload");
  const browseButton = document.getElementById("browse-button");
  const selectedFileName = document.getElementById("selected-file-name");
  const generateButton = document.getElementById("generate-button");
  const resultsContainer = document.getElementById("results-container");
  const userPreferencesContainer = document.getElementById(
    "user-preferences-container"
  );
  const savedQuestionsContainer = document.getElementById(
    "saved-questions-container"
  );
  const customTemplatesContainer = document.getElementById(
    "custom-templates-container"
  );

  const registerButton = document.getElementById("register-button");
  const loginButton = document.getElementById("login-button");
  const registerUsername = document.getElementById("register-username");
  const registerPassword = document.getElementById("register-password");
  const loginUsername = document.getElementById("login-username");
  const loginPassword = document.getElementById("login-password");

  const mainContainer = document.getElementById("main-container");
  const registrationContainer = document.getElementById(
    "registration-container"
  );
  const loginContainer = document.getElementById("login-container");
  const defaultApiKey = "API_KEY"; // Replace with your actual default API key

  let loggedInUser = null;

  // Show contentInput initially (text input)
  textInput.hidden = false;

  // Handle input type changes
  inputTypeSelect.addEventListener("change", () => {
    const selectedInputType = inputTypeSelect.value;
    textInput.hidden = selectedInputType !== "text";
    urlInput.hidden = selectedInputType !== "url";
    documentUpload.hidden = selectedInputType !== "document";
    browseButton.hidden = selectedInputType !== "document";
    if (selectedInputType !== "document") {
      selectedFileName.textContent = "";
    }
  });

  // Handle document upload selection
  browseButton.addEventListener("click", () => {
    documentUpload.click();
  });

  // Update selected file name when a file is chosen
  documentUpload.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    selectedFileName.textContent = `Selected file: ${file.name}`;
    // Optionally, you can preview the file content here if needed
  });

  // Helper function to read file content
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Handle generate button click
  generateButton.addEventListener("click", async () => {
    const inputType = inputTypeSelect.value;
    let content;

    if (inputType === "text") {
      content = textInput.value;
    } else if (inputType === "url") {
      content = urlInput.value;
    } else if (inputType === "document") {
      const file = documentUpload.files[0];
      content = await file.text(); // Read the file content as text
    }

    if (!content) {
      alert("Please enter content or select a file.");
      return;
    }

    const questionTypes = Array.from(
      document.querySelectorAll('input[name="question-type[]"]:checked')
    ).map((checkbox) => checkbox.value);

    if (questionTypes.length === 0) {
      alert("Please select at least one question type.");
      return;
    }

    const difficulty = document.getElementById("difficulty").value;
    const userApiKey = document.getElementById("api-key").value;
    const apiKey = userApiKey || defaultApiKey;

    // Prepare the request payload
    const requestBody = {
      content: content,
      questionTypes: questionTypes,
      difficulty: difficulty,
      apiKey: apiKey,
      userId: loggedInUser ? loggedInUser.UserID : null, // Pass user ID if logged in
    };

    console.log("Request Body:", requestBody); // Debugging

    // AJAX request to PHP endpoint
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "generate_questions.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          resultsContainer.innerHTML = "<h3>Generated Questions:</h3>";
          if (response.questions.length) {
            response.questions.forEach((question, index) => {
              resultsContainer.innerHTML += `<p>Question ${
                index + 1
              }: ${question}</p>`;
            });
          } else {
            resultsContainer.innerHTML +=
              "<p>No questions generated. Please check your input or API connection.</p>";
          }
        } else {
          resultsContainer.innerHTML = `<p>Error generating questions: ${response.error}</p>`;
        }
      }
    };
    xhr.send(JSON.stringify(requestBody));
  });

  // Register button click handler
  registerButton.addEventListener("click", async () => {
    const username = registerUsername.value;
    const password = registerPassword.value;
    const firstName = ""; // Add first name input field if needed
    const lastName = ""; // Add last name input field if needed

    const response = await fetch("register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const data = await response.json();
    if (data.success) {
      alert(data.message);
      // Hide registration container and show login container
      registrationContainer.style.display = "none";
      loginContainer.style.display = "block";
    } else {
      alert(data.message);
    }
  });

  // Login button click handler
  loginButton.addEventListener("click", async () => {
    const username = loginUsername.value;
    const password = loginPassword.value;

    const response = await fetch("login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const data = await response.json();
    if (data.success) {
      alert(data.message);
      // Store logged-in user data
      loggedInUser = data.user;
      // Hide login container
      loginContainer.style.display = "none";
      // Show user-specific features
      showUserFeatures();
    } else {
      alert(data.message);
    }
  });

  // Function to show user-specific features
  function showUserFeatures() {
    // Show user preferences container
    userPreferencesContainer.style.display = "block";
    // Show saved questions container
    savedQuestionsContainer.style.display = "block";
    // Show custom templates container
    customTemplatesContainer.style.display = "block";
  }

  // Add template
  document
    .getElementById("save-template-button")
    .addEventListener("click", async () => {
      const templateName = document.getElementById("template-name").value;
      const templateText = document.getElementById("template-text").value;

      const response = await fetch("add_template.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateName,
          templateText,
          customTemplate: templateText,
        }),
      });

      const data = await response.json();
      alert(data.message);
    });

  // Remove template
  // Assume there is a button for each template with class 'remove-template-button'
  document.querySelectorAll(".remove-template-button").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const templateId = event.target.dataset.templateId;

      const response = await fetch("remove_template.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });

      const data = await response.json();
      alert(data.message);
    });
  });

  // Update user preferences
  document
    .getElementById("update-preferences-button")
    .addEventListener("click", async () => {
      const userId = loggedInUser.UserID;
      const theme = document.getElementById("theme").value;
      const language = document.getElementById("language").value;

      const response = await fetch("update_preferences.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, theme, language }),
      });

      const data = await response.json();
      alert(data.message);
    });

  // Function to add a question
  async function addQuestion(questionText) {
    const response = await fetch("add_question.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: loggedInUser.UserID, questionText }),
    });

    const data = await response.json();
    alert(data.message);
  }

  // Example usage: Call this function when you want to add a question
  // addQuestion("Sample question text");

  // Function to remove a question
  async function removeQuestion(questionId) {
    const response = await fetch("remove_question.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId }),
    });

    const data = await response.json();
    alert(data.message);
  }

  // Example usage: Call this function when you want to remove a question
  // removeQuestion(1); // Assuming 1 is the ID of the question you want to remove

  // Updated function to update possible questions table
  function updatePossibleQuestionsTable(questions) {
    const possibleQuestionsTableBody = document.querySelector(
      "#possible-questions-table tbody"
    );
    possibleQuestionsTableBody.innerHTML = "";

    questions.forEach((question) => {
      const row = document.createElement("tr");
      const typeCell = document.createElement("td");
      const questionCell = document.createElement("td");

      typeCell.textContent = question.type;
      questionCell.textContent = question.text;

      row.appendChild(typeCell);
      row.appendChild(questionCell);
      possibleQuestionsTableBody.appendChild(row);
    });

    // Show the table after updating
    const possibleQuestionsTable = document.getElementById(
      "possible-questions-table"
    );
    possibleQuestionsTable.style.display = "block";
  }

  // Updated function to fetch possible questions
  async function fetchPossibleQuestions(content, apiKey) {
    const response = await fetch("get_possible_questions.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        apiKey: apiKey,
      }),
    });
    const data = await response.json();
    if (data.success) {
      updatePossibleQuestionsTable(data.questions);
    } else {
      alert("Failed to fetch possible questions: " + data.error);
    }
  }

  // Add event listener to the "Show Possible Questions" button
  document
    .getElementById("show-possible-questions-button")
    .addEventListener("click", () => {
      const inputType = inputTypeSelect.value;
      let content;

      if (inputType === "text") {
        content = textInput.value;
      } else if (inputType === "url") {
        content = urlInput.value;
      } else if (inputType === "document") {
        content = documentUpload.files[0];
      }

      if (!content && inputType !== "document") {
        alert("Please enter content or select a file.");
        return;
      } else if (inputType === "document" && !content) {
        alert("Please select a document to upload.");
        return;
      }

      const userApiKey = document.getElementById("api-key").value;
      const apiKey = userApiKey || defaultApiKey;

      // Fetch possible questions
      fetchPossibleQuestions(content, apiKey);
    });

  // Handle generate button click
  generateButton.addEventListener("click", () => {
    const inputType = inputTypeSelect.value;
    let content;

    if (inputType === "text") {
      content = textInput.value;
    } else if (inputType === "url") {
      content = urlInput.value;
    } else if (inputType === "document") {
      content = documentUpload.files[0];
    }

    if (!content && inputType !== "document") {
      alert("Please enter content or select a file.");
      return;
    } else if (inputType === "document" && !content) {
      alert("Please select a document to upload.");
      return;
    }

    const userApiKey = document.getElementById("api-key").value;
    const apiKey = userApiKey || defaultApiKey;

    // Fetch possible questions
    fetchPossibleQuestions(content, apiKey);

    // AJAX request to PHP endpoint for generating questions
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "generate_questions.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          resultsContainer.innerHTML = "<h3>Generated Questions:</h3>";
          if (response.questions.length) {
            response.questions.forEach((question, index) => {
              resultsContainer.innerHTML += `<p>Question ${
                index + 1
              }: ${question}</p>`;
            });
          } else {
            resultsContainer.innerHTML +=
              "<p>No questions generated. Please check your input or API connection.</p>";
          }
        } else {
          resultsContainer.innerHTML = `<p>Error generating questions: ${response.error}</p>`;
        }
      }
    };
    const requestBody = JSON.stringify({
      content: content,
      apiKey: apiKey,
      userId: loggedInUser ? loggedInUser.UserID : null, // Pass user ID if logged in
    });
    xhr.send(requestBody);
  });

  // Remove the unnecessary event listener removal
  // generateButton.removeEventListener("click", generateQuestions);

  // Add event listener to the "Show Possible Questions" button
  const showPossibleQuestionsButton = document.getElementById(
    "show-possible-button"
  ); // Updated ID
  showPossibleQuestionsButton.addEventListener("click", showPossibleQuestions);

  // New function to show possible questions
  function showPossibleQuestions() {
    const inputType = inputTypeSelect.value;
    let content;

    if (inputType === "text") {
      content = textInput.value;
    } else if (inputType === "url") {
      content = urlInput.value;
    } else if (inputType === "document") {
      content = documentUpload.files[0];
    }

    if (!content && inputType !== "document") {
      alert("Please enter content or select a file.");
      return;
    } else if (inputType === "document" && !content) {
      alert("Please select a document to upload.");
      return;
    }

    const userApiKey = document.getElementById("api-key").value;
    const apiKey = userApiKey || defaultApiKey;

    // Fetch and show possible questions
    fetchPossibleQuestions(content, apiKey);
  }

  // Updated function to update possible questions table
  function updatePossibleQuestionsTable(questions) {
    const possibleQuestionsTableBody = document.querySelector(
      "#possible-questions-table tbody"
    );
    possibleQuestionsTableBody.innerHTML = "";

    questions.forEach((question) => {
      const row = document.createElement("tr");
      const typeCell = document.createElement("td");
      const questionCell = document.createElement("td");

      typeCell.textContent = question.type;
      questionCell.textContent = question.text;

      row.appendChild(typeCell);
      row.appendChild(questionCell);
      possibleQuestionsTableBody.appendChild(row);
    });

    // Show the table after updating
    const possibleQuestionsTable = document.getElementById(
      "possible-questions-table"
    );
    possibleQuestionsTable.style.display = "block";
  }

  // Updated function to fetch possible questions
  async function fetchPossibleQuestions(content, apiKey) {
    const response = await fetch("get_possible_questions.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        apiKey: apiKey,
      }),
    });
    const data = await response.json();
    if (data.success) {
      updatePossibleQuestionsTable(data.questions);
    } else {
      alert("Failed to fetch possible questions: " + data.error);
    }
  }

  // Add event listener to the "Show Possible Questions" button
  document
    .getElementById("show-possible-button")
    .addEventListener("click", () => {
      const inputType = inputTypeSelect.value;
      let content;

      if (inputType === "text") {
        content = textInput.value;
      } else if (inputType === "url") {
        content = urlInput.value;
      } else if (inputType === "document") {
        content = documentUpload.files[0];
      }

      if (!content && inputType !== "document") {
        alert("Please enter content or select a file.");
        return;
      } else if (inputType === "document" && !content) {
        alert("Please select a document to upload.");
        return;
      }

      const userApiKey = document.getElementById("api-key").value;
      const apiKey = userApiKey || defaultApiKey;

      // Fetch possible questions
      fetchPossibleQuestions(content, apiKey);
    });
});
