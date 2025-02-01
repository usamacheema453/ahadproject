document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  // Callback function to handle the API response
  const handleLoginResponse = (responseStatus, responseData) => {
    if (responseStatus === 200 && responseData.token) {
      // Store token in localStorage
      localStorage.setItem("token", responseData.token);
      
      // Redirect to profile page
      window.location.href = "profile.html";
    } else {
      // Show warning card with error message
      warningCard.classList.remove("d-none");
      warningText.innerText = responseData.message || "Login failed. Please try again.";
    }
  };

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Create login data object
    const loginData = {
      username: username,
      password: password,
    };

    // Send login request using fetchMethod
    fetchMethod("/api/login", handleLoginResponse, "POST", loginData);
  });
});
