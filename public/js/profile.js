document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
  
    // Redirect to login page if no token is found
    if (!token) {
      window.location.href = "login.html";
      return;
    }
  
    // Decode user ID from token or set it directly
    const userId = getUserIdFromToken(token);
  
    // Fetch user profile data
    fetch(`/api/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Populate profile information
        document.getElementById("username").innerText = data.username || "N/A";
        document.getElementById("userId").innerText = data.user_id || "N/A";
        document.getElementById("email").innerText = data.email || "N/A";
        document.getElementById("createdOn").innerText = new Date(
          data.created_on
        ).toLocaleDateString() || "N/A";
        document.getElementById("points").innerText = data.points || "N/A";
  
        // Populate user's pets
        const petsList = document.getElementById("petsList");
        petsList.innerHTML = ""; // Clear previous content
  
        if (data.pets && data.pets.length > 0) {
          data.pets.forEach((pet) => {
            const petCard = document.createElement("div");
            petCard.className = "col-md-4";
  
            petCard.innerHTML = `
              <div class="pet-card">
                <h5>${pet.species}</h5>
                <p>Happiness: ${pet.happiness_level}</p>
                <p>Skill Points: ${pet.skill_points}</p>
              </div>
            `;
            petsList.appendChild(petCard);
          });
        } else {
          petsList.innerHTML = `<p>No pets available. Adopt one to see it here!</p>`;
        }
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        alert("Failed to load profile. Please try again later.");
      });
  });
  
  // Helper function to decode user ID from token
  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      return payload.user_id; // Replace with your payload key
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  
  