const express = require('express');
const router = express.Router();

const fitnessChallengesControllers = require('../controllers/fitnessChallengesControllers');

//Create Challenge
router.post('/', fitnessChallengesControllers.createChallenge);

//Get all Challenges
router.get('/', fitnessChallengesControllers.readAllChallenges);

//Update Challenge By Challenge Id
router.put('/:challenge_id',fitnessChallengesControllers.checkChallengeIdExists,fitnessChallengesControllers.checkCreatorIdBelongToUserId,fitnessChallengesControllers.updateChallengesById)

//Delete Challenge By Challenge Id 
router.delete('/:challenge_id',fitnessChallengesControllers.checkChallengeIdExists,fitnessChallengesControllers.deleteChallengeById)


module.exports = router;

