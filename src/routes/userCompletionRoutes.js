const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

const userCompletionController = require('../controllers/userCompletionController');
const fitnessChallengesController = require('../controllers/fitnessChallengesControllers');

//Create Challenge Record and Update user skillpoints 
router.post(
  "/:challenge_id",
  userController.validateRequestAndUser,
  fitnessChallengesController.validateChallenge,
  userCompletionController.createCompletionRecord,
  userCompletionController.updateUserSkillpointsAndRespond
);
//Check All Challenge Records 
router.get('/:challenge_id',userCompletionController.checkAllChallengeRecords)

module.exports = router;

