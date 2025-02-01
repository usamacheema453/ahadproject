const express = require('express');
const router = express.Router();

const petsController = require('../controllers/petsController');

// Pets routes
// Create a new pet
// Buy a pet
// Route for buying a pet (User)
router.post("/users/:user_id/buy", petsController.buyPet);

// Route for creating a pet (Admin/System)
router.post("/admin/create/users/:user_id", petsController.isAdmin, petsController.createPet);

// Get all pets for a user
router.get("/users/:user_id", petsController.getUserPets);

router.get("/", petsController.getPets);


// Update pet details
router.put("/:pet_id/admin/users/:user_id/", petsController.updatePetById);

// Delete a pet
router.delete("/:pet_id/admin/users/:user_id/",petsController.isAdmin, petsController.deletePetById);

// Update pet happiness
router.put("/:pet_id/admin/happiness", petsController.updatePetHappiness);


module.exports = router;
