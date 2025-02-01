const itemModel = require('../models/itemModel');
const userModel = require('../models/userModel');
const inventoryModel = require('../models/inventoryModel');
const petsModel=require('../models/petsModel')

module.exports.buyItem = (req, res) => {
    const { user_id } = req.params;
    const { item_id, quantity } = req.body;

    if (!user_id || !item_id || !quantity) {
        return res.status(400).json({ message: "Missing required fields: user_id, item_id, or quantity." });
    }

    // Fetch item details
    itemModel.fetchItemById(item_id, (itemError, itemResults) => {
        if (itemError || !itemResults || itemResults.length === 0) {
            return res.status(404).json({ message: "Item not found in shop." });
        }

        const item = itemResults[0]; // Extract item details
        const totalCost = item.price * quantity;

        // Check user skillpoints
        userModel.fetchUserSkillpoints(user_id, (userError, userResults) => {
            if (userError || !userResults || userResults.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }

            const user = userResults[0];
            if (user.skillpoints < totalCost) {
                return res.status(400).json({ message: "Insufficient skillpoints." });
            }

            // Deduct skillpoints
            userModel.deductSkillpoints(user_id, totalCost, (deductError, deductResults) => {
                if (deductError || deductResults.affectedRows === 0) {
                    return res.status(500).json({ message: "Error deducting skillpoints." });
                }

                // Add item to inventory
                inventoryModel.addToInventory(user_id, item_id, quantity, (inventoryError) => {
                    if (inventoryError) {
                        return res.status(500).json({ message: "Error adding item to inventory." });
                    }

                    res.status(200).json({
                        message: "Item purchased successfully!",
                        item_id,
                        item_name: item.item_name, // Include item name in the response
                        quantity,
                        remaining_skillpoints: user.skillpoints - totalCost
                    });
                });
            });
        });
    });
};


//use item 
module.exports.useItem = (req, res) => {
    const { user_id, pet_id } = req.params; // User and Pet IDs from URL
    const { item_id } = req.body; // Item ID from request body

    // Validate input
    if (!user_id || !pet_id || !item_id) {
        return res.status(400).json({ message: "Missing required fields: user_id, pet_id, or item_id." });
    }

    // Step 1: Check if the user has purchased any pets
    petsModel.getUserPets(user_id, (petsError, petsResults) => {
        if (petsError) {
            return res.status(500).json({ message: "Error fetching user's pets.", error: petsError });
        }

        if (!petsResults || petsResults.length === 0) {
            return res.status(400).json({ message: "User has no pets. Items can only be used with purchased pets." });
        }

        // Step 2: Fetch the pet to validate ownership
        petsModel.getPetById(pet_id, (petError, petResults) => {
            if (petError || !petResults || petResults.length === 0) {
                return res.status(404).json({ message: "Pet not found." });
            }

            const pet = petResults[0];

            // Validate that the pet belongs to the user
            if (pet.user_id !== parseInt(user_id, 10)) {
                return res.status(403).json({ message: "This pet does not belong to the user." });
            }

            // Step 3: Check if the user owns the item
            inventoryModel.getUserItem(user_id, item_id, (inventoryError, inventoryResults) => {
                if (inventoryError || !inventoryResults || inventoryResults.length === 0 || inventoryResults[0].quantity <= 0) {
                    return res.status(404).json({ message: "Item not found in inventory or insufficient quantity." });
                }

                const item = inventoryResults[0]; // Includes item_name and effect_happiness

                // Step 4: Calculate the new happiness level
                const newHappiness = Math.min(pet.happiness_level + item.effect_happiness, 100); // Cap happiness at 100

                // Step 5: Update the pet's happiness
                petsModel.updateHappiness(pet_id, newHappiness, (updatePetError) => {
                    if (updatePetError) {
                        return res.status(500).json({ message: "Error updating pet happiness." });
                    }

                    // Step 6: Deduct the item from inventory
                    inventoryModel.reduceItemQuantity(user_id, item_id, (updateInventoryError) => {
                        if (updateInventoryError) {
                            return res.status(500).json({ message: "Error updating inventory." });
                        }

                        // Success response
                        res.status(200).json({
                            message: "Item used successfully!",
                            item_id,
                            item_name: item.item_name,
                            pet_id,
                            new_happiness_level: newHappiness
                        });
                    });
                });
            });
        });
    });
};

