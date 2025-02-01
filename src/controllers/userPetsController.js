const userPetsModel = require("../models/userPetsModel");

// Controller to adopt a pet
module.exports.adoptPet = (req, res) => {
    const { user_id, pet_id } = req.body;

    if (!user_id || !pet_id) {
        return res.status(400).json({ message: "Missing user_id or pet_id." });
    }

    userPetsModel.adoptPet(user_id, pet_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error adopting pet.", error });
        }
        res.status(201).json({
            message: "Pet adopted successfully!",
            user_pet_id: results.insertId
        });
    });
};

// Controller to get all pets owned by a user
module.exports.getUserPets = (req, res) => {
    const { user_id } = req.params;

    userPetsModel.getUserPets(user_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error fetching user's pets.", error });
        }
        res.status(200).json(results);
    });
};

// Controller to update happiness level
module.exports.updateHappinessLevel = (req, res) => {
    const { user_pet_id, happiness_level } = req.body;

    if (!user_pet_id || happiness_level === undefined) {
        return res.status(400).json({ message: "Missing user_pet_id or happiness_level." });
    }

    userPetsModel.updateHappinessLevel(user_pet_id, happiness_level, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error updating happiness level.", error });
        }
        res.status(200).json({ message: "Happiness level updated successfully!" });
    });
};

// Controller to release a pet
module.exports.releasePet = (req, res) => {
    const { user_pet_id } = req.params;

    if (!user_pet_id) {
        return res.status(400).json({ message: "Missing user_pet_id." });
    }

    userPetsModel.releasePet(user_pet_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error releasing pet.", error });
        }
        res.status(200).json({ message: "Pet released successfully!" });
    });
};