const model = require('../models/fitnessChallengesModel.js');

//Create Challenge
module.exports.createChallenge = (req, res, next) => {
    if (!req.body.challenge || !req.body.user_id || !req.body.skillpoints) {
        res.status(400).json({
            message: "Error: Missing challenge, user_id, or skillpoints"
        });
        return;
    }

    const data = {
        challenge: req.body.challenge,
        creator_id: req.body.user_id,
        skillpoints: req.body.skillpoints
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createChallenge:", error);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            res.status(201).json({
                challenge_id: results.insertId, 
                challenge: data.challenge,
                creator_id: Number(data.creator_id), 
                skillpoints: Number(data.skillpoints)
            });
        }
    };

    model.insertChallenge(data, callback);
};

//Get all Challenges 
module.exports.readAllChallenges = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllChallenges:", error);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            res.status(200).json(results);
        }
    };

    model.selectAllChallenge(callback);
};

//Check Challenges Id Exists 
module.exports.checkChallengeIdExists = (req, res, next) => {   
    const data = {
        challenge_id: req.params.challenge_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkChallengeIdExists:", error);
            res.status(500).json({ message: "Internal Server Error" });
        } else if (!results || results.length === 0) {
            res.status(404).json({
                message: "Challenge Id does not exist"
            });
        } else {
            next();
        }
    };

    model.selectChallengeId(data, callback);
};

//Check Association 
module.exports.checkCreatorIdBelongToUserId = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id,
        user_id: req.body.user_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkCreatorIdBelongToUserId:", error);
            res.status(500).json({ message: "Internal Server Error" });
        } else if (results.length === 0) {
            res.status(403).json({
                message: "Forbidden: You are not the creator of this challenge"                    
            });
        } else {
            next();
        }
    };

    model.selectAssociation(data, callback);
};

//Update Challenge By Id
module.exports.updateChallengesById = (req, res, next) => {
    if (req.body.user_id === undefined || req.body.challenge === undefined || req.body.skillpoints === undefined) {
        return res.status(400).json({
            message: "Missing required data"
        });
    }

    const data = {
        challengeId: Number(req.params.challenge_id),   
        creator_id: Number(req.body.user_id),           
        challenge: req.body.challenge,          
        skillpoints: Number(req.body.skillpoints)       
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateChallengesById:", error);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            res.status(200).json({
                challenge_id: data.challengeId, 
                challenge: data.challenge,      
                creator_id: data.creator_id,    
                skillpoints: data.skillpoints   
            });
        }
    };

    model.updateChallengesById(data, callback);
};

//Delete Challenge By Id 
module.exports.deleteChallengeById = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteChallengeById:", error);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            res.status(204).send(); // 204 No Content  
        }
    };

    model.deleteById(data, callback);
};


//validateChallenge
module.exports.validateChallenge = (req, res, next) => {
    const { challenge_id } = req.params;
  
    if (!challenge_id) {
      return res.status(400).json({
        message: "challenge_id is required in the URL parameter.",
      });
    }
  
    const data = { challenge_id };
  
    const callback = (error, results) => {
      if (error) {
        console.error("Error in selectChallengeByChallengeId:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
  
      if (results.length == 0) {
        return res.status(404).json({ message: "Challenge not found" });
      }
  
      req.challenge = results[0];
      next();
    };
  
    model.selectChallengeByChallengeId(data, callback);
  };
  