const model = require("../models/questsModel");
// const userCompletionModel = require("../models/userCompletionModel");
// const petsModel=require('../models/petsModel')
// const userModel=require('../models/userModel')


module.exports. createQuest = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, // User ID from URL params
        pet_id: req.body.pet_id,    // Pet ID from request body
        quest: req.body.quest,      // Quest description
        reward: req.body.reward,    // Reward (e.g., skill points)
        status: "in-progress",      // Default status
    };

    // Validate required fields
    if (!data.user_id || !data.pet_id || !data.quest || !data.reward) {
        return res.status(400).json({
            message: "Missing required fields. Please include pet_id, quest, and reward.",
        });
    }

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json({
                message: "Error creating quest.",
                error,
            });
        }

        res.status(201).json({
            message: "Quest created successfully!",
            quest: {
                quest_id: results.insertId,
                name: data.quest,
                reward: data.reward,
                status: data.status,
            },
        });
    };

    // Call the model to insert the quest
    model.createQuest(data, callback);
};

module.exports.getUserQuests = (req, res, next) => {
    const user_id = req.params.user_id; // User ID from URL params

    // Validate required field
    if (!user_id) {
        return res.status(400).json({
            message: "Missing user_id parameter.",
        });
    }

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json({
                message: "Error retrieving quests.",
                error: error,
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "No quests found for the given user ID.",
            });
        }

        // Format the results
        const formattedResults = results.map((result) => ({
            quest_id: result.quest_id,
            name: result.quest,
            reward: result.reward,
            status: result.status,
            pet: {
                pet_id: result.pet_id,
                name: result.pet_name,
                species: result.species,
            },
        }));

        res.status(200).json({
            message: "Quests retrieved successfully!",
            quests: formattedResults,
        });
    };

    // Call the model to fetch quests by user ID
    model.getQuestsByUserId(user_id, callback);
};

module.exports.validateQuestOwnership = (req, res, next) => {
    const { user_id } = req.params; // User ID from URL params
    const { quest_id } = req.body; // Quest ID from the request body

    if (!quest_id || !user_id) {
        return res.status(400).json({
            message: "Missing required fields. Please include user_id in params and quest_id in the body.",
        });
    }

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json({
                message: "Error validating quest ownership.",
                error,
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: `Quest ID (${quest_id}) does not belong to User ID (${user_id}).`,
            });
        }

        req.validatedQuest = results[0]; // Attach quest details to the request for further use
        next();
    };

    model.validateQuestOwnership(user_id, quest_id, callback);
};
module.exports.updateQuestStatusWithReward = (req, res) => {
    const { user_id } = req.params; // User ID from URL params
    const { quest_id, status } = req.body; // Quest ID and new status from the request body
    const questDetails = req.validatedQuest; // Retrieved from the previous middleware

    if (status.toLowerCase() !== "completed") {
        return res.status(400).json({
            message: "Reward can only be given for completed quests.",
        });
    }

    const rewardPoints = questDetails.reward; // Fetch reward points from the quest

    const updateSkillPointsCallback = (error) => {
        if (error) {
            return res.status(500).json({
                message: "Error updating user skillpoints.",
                error,
            });
        }

        const updateQuestStatusCallback = (questError) => {
            if (questError) {
                return res.status(500).json({
                    message: "Error updating quest status.",
                    error: questError,
                });
            }

            res.status(200).json({
                message: "Quest completed successfully!",
                quest_id,
                user_id,
                awarded_skillpoints: rewardPoints,
                new_status: status,
            });
        };

        model.updateQuestStatus({ quest_id, status }, updateQuestStatusCallback);
    };

    model.addSkillPoints(user_id, rewardPoints, updateSkillPointsCallback);
};