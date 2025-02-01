document.addEventListener("DOMContentLoaded", function () {
    // Check if the user is logged in
    const token = localStorage.getItem("token");

    const warningMessage = document.getElementById("warningMessage");
    const inventoryContent = document.getElementById("inventoryContent");

    if (token) {
      // User is logged in, show inventory
      inventoryContent.classList.remove("d-none");
    } else {
      // User is not logged in, show warning
      warningMessage.classList.remove("d-none");
    }
  });