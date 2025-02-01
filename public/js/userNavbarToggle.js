document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const isLoggedIn = token !== null;

  // Navbar elements
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const profileLink = document.getElementById("profileLink");
  const logoutLink = document.getElementById("logoutLink");

  // Adjust navbar visibility
  if (isLoggedIn) {
    loginLink?.classList.add("d-none");
    registerLink?.classList.add("d-none");
    profileLink?.classList.remove("d-none");
    logoutLink?.classList.remove("d-none");
  } else {
    loginLink?.classList.remove("d-none");
    registerLink?.classList.remove("d-none");
    profileLink?.classList.add("d-none");
    logoutLink?.classList.add("d-none");
  }

  // Handle logout
  const logoutButton = document.getElementById("logoutButton");
  logoutButton?.addEventListener("click", () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    window.location.reload(); // Reload the page
  });
});
