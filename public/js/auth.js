// Check if the user is logged in
function isLoggedIn() {
  // This simulates checking login status; replace with real API or session logic.
  return document.body.getAttribute("data-logged-in") === "true";
}

// Show a login-required modal or error message
function showLoginRequiredMessage() {
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  loginModal.show();
}

// Export utility for global use
export { isLoggedIn, showLoginRequiredMessage };
