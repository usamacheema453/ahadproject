const express = require('express');
const router = express.Router();

const questsController = require('../controllers/questsController');
// Quests routes

//Create Quest
router.post('/users/:user_id', questsController.createQuest);


router.get('/users/:user_id', questsController.getUserQuests);
router.put(
    '/users/:user_id/status',
    questsController.validateQuestOwnership,
    questsController.updateQuestStatusWithReward
);
module.exports = router;

