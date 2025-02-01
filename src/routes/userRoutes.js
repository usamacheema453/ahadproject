const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


//Create User
router.post('/',userController.checkUserExist,userController.createUser);

//Get All Users 
router.get('/', userController.readAllUsers);

router.get('/:user_id', userController.getUserbyUserId);

//Update User By Id
router.put('/:user_id', userController.checkUserIdExists, 
    userController.checkUserExist, 
    userController.updateUserById);
    router.get('/leaderboard', userController.getLeaderboard);
    router.put('/:user_id/skillpoints', userController.updateUserSkillpoints);
    router.post('/leaderboard/reset', userController.validateAdmin,userController.resetLeaderboard);

module.exports = router;

