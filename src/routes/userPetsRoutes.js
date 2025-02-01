const express = require("express");
const router = express.Router();
const userPetsController = require("../controllers/userPetsController");

// Route to adopt a pet
router.post("/adopt", userPetsController.adoptPet);

// Route to get all pets owned by a user
router.get("/users/:user_id", userPetsController.getUserPets);

// Route to update happiness level
router.put("/updateHappiness", userPetsController.updateHappinessLevel);

// Route to release a pet
router.delete("/release/:user_pet_id", userPetsController.releasePet);

module.exports = router;