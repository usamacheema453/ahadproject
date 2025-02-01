const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const fitnessChallengesRoutes = require('./fitnessChallengesRoutes');
const userCompletionRoutes = require('./userCompletionRoutes');
const userController = require('../controllers/userController');
const bcryptMiddleware=require('../middlewares/bcryptMiddleware');
const jwtMiddleware=require('../middlewares/jwtMiddleware')

const petsRoutes = require('./petsRoutes');
const questsRoutes = require('./questsRoutes');
const itemRoutes = require('./itemRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const reviewRoutes = require('./reviewRoutes');
const userpetsRoutes = require('./userPetsRoutes');


router.post("/login", userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.post("/register", userController.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, userController.register, jwtMiddleware.generateToken, jwtMiddleware.sendToken);


router.use("/users", userRoutes);
router.use("/challenges",fitnessChallengesRoutes)
router.use("/challenges",userCompletionRoutes)
router.use("/pets", petsRoutes);
router.use("/quests", questsRoutes);
router.use("/items", itemRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/review", reviewRoutes);
router.use("/user-pets", userpetsRoutes);




module.exports = router;