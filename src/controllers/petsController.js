const model = require("../models/petsModel");
const userModel = require("../models/userModel"); // For skillpoints validation
const questsModel = require("../models/questsModel");


module.exports.isAdmin = (req, res, next) => {
    const { user_id } = req.params; // Assuming user_id is passed in the route params

    if (!user_id) {
        return res.status(400).json({ message: "Missing user ID in the request." });
    }

    userModel.getUserAdminById(user_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error fetching user data.", error });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const user = results[0];

        if (!user.is_admin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        // If user is admin, proceed to the next middleware or controller
        next();
    });
};

// Middleware: Validate Pet Ownership


module.exports.buyPet = (req, res) => {
    const data = {
        user_id: req.params.user_id,
        pet_id: req.params.pet_id,
    };

    // Validate input
    if (!data.user_id || !data.pet_id) {
        return res.status(400).json({ message: "Missing required fields: user_id or pet_id." });
    }

    // Fetch pet details using pet_id
    model.fetchPetById(data.pet_id, (petError, petResults) => {
        if (petError || !petResults || petResults.length === 0) {
            return res.status(404).json({ message: "Pet not found." });
        }

        const pet = petResults[0];

        // Fetch user's skillpoints
        userModel.fetchUserSkillpoints(data.user_id, (userError, userResults) => {
            if (userError || !userResults || userResults.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }

            const user = userResults[0];
            if (user.skillpoints < pet.cost_in_skillpoints) {
                return res.status(400).json({ message: "Insufficient skill points to purchase this pet." });
            }

            // Deduct Skillpoints
            userModel.deductSkillpoints(data.user_id, pet.cost_in_skillpoints, (deductError) => {
                if (deductError) {
                    return res.status(500).json({ message: "Error deducting skill points.", error: deductError });
                }

                // Link the pet to the user (ownership)
                model.assignPetToUser(data.user_id, data.pet_id, (assignError, assignResults) => {
                    if (assignError) {
                        return res.status(500).json({ message: "Error assigning pet to user.", error: assignError });
                    }

                    res.status(201).json({
                        message: "Pet purchased successfully!",
                        pet_id: data.pet_id,
                        user_id: data.user_id,
                        pet_name: pet.pet_name,
                        species: pet.species,
                        remaining_skillpoints: user.skillpoints - pet.cost_in_skillpoints,
                    });
                });
            });
        });
    });
};

// Controller: Create a Pet (Admin/System Action)
module.exports.createPet = (req, res) => {
    const { pet_name, species, cost_in_skillpoints = 0 } = req.body;

    // Validate input
    if (!pet_name || !species) {
        return res.status(400).json({
            message: "Missing required fields: pet_name or species.",
        });
    }

    const data = {
        pet_name,
        species,
        cost_in_skillpoints,
    };

    model.createPet(data, (error, results) => {
        if (error) {
            console.error("Error creating pet:", error);
            return res.status(500).json({
                message: "Error creating pet.",
                error: error,
            });
        }

        res.status(201).json({
            message: "Pet created successfully!",
            pet_id: results.insertId,
            ...data, // Automatically includes pet_name, species, and cost_in_skillpoints
        });
    });
};



// Route 2: Retrieve All Pets for a User
module.exports.getUserPets = (req, res) => {
    const user_id = req.params.user_id;

    model.getPetsByUserId(user_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error retrieving pets.", error });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No pets found for this user." });
        }

        res.status(200).json(results);
    });
};

module.exports.getPets = (req, res) => {
    model.getAllPets((error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error retrieving all pets.", error });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No pets found." });
        }

        res.status(200).json(results);
    });
};
// Route 3: Update Pet by ID
module.exports.updatePetById = (req, res) => {
    const data = {
        pet_id: req.params.pet_id,
        pet_name: req.body.pet_name,
        species: req.body.species,
    };

    if (!data.pet_name || !data.species) {
        return res.status(400).json({ message: "Missing required fields: pet_name or species." });
    }

    model.updateById(data, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error updating pet details.", error });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Pet not found or update failed." });
        }

        res.status(200).json({
            message: "Pet updated successfully!",
            pet_id: data.pet_id,
            pet_name: data.pet_name,
            species: data.species,
        });
    });
};

// Controller: Delete a Pet by ID
module.exports.deletePetById = (req, res) => {
    const pet_id = req.params.pet_id;

    // Step 1: Delete associated quests
    questsModel.deleteQuestsByPetId(pet_id, (questError) => {
        if (questError) {
            return res.status(500).json({
                message: "Error deleting associated quests.",
                error: questError,
            });
        }

        // Step 2: Delete the pet
        model.deletePetById(pet_id, (petError, petResults) => {
            if (petError) {
                return res.status(500).json({
                    message: "Error deleting pet.",
                    error: petError,
                });
            }

            if (petResults.affectedRows === 0) {
                return res.status(404).json({
                    message: "Pet not found.",
                });
            }

            res.status(200).json({
                message: "Pet and associated quests deleted successfully!",
            });
        });
    });
};


// Route 5: Update Pet Happiness
module.exports.updatePetHappiness = (req, res) => {
    const { pet_id } = req.params; // Pet ID from URL params
    const { happinessChange } = req.body; // Change value in the request body

    // Validation: Check if happinessChange is provided and is a valid number
    if (happinessChange === undefined || typeof happinessChange !== "number") {
        return res.status(400).json({ message: "Invalid happiness value. It must be a number." });
    }

    // Ensure the final happiness level stays within 0 and 100
    model.getPetById(pet_id, (error, results) => {
        if (error || !results || results.length === 0) {
            return res.status(404).json({ message: "Pet not found." });
        }

        const currentHappiness = results[0].happiness_level; // Current pet happiness
        const newHappiness = Math.min(Math.max(currentHappiness + happinessChange, 0), 100);

        model.setPetHappiness(pet_id, newHappiness, (updateError, updateResults) => {
            if (updateError) {
                return res.status(500).json({ message: "Error updating pet happiness.", error: updateError });
            }

            if (updateResults.affectedRows === 0) {
                return res.status(404).json({ message: "Pet not found." });
            }

            res.status(200).json({
                message: "Pet happiness updated successfully!",
                pet_id,
                new_happiness_level: newHappiness,
            });
        });
    });
};