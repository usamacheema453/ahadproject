const model = require('../models/userCompletionModel.js');

//Create a completion record for challenge 
module.exports.insertChallengeRecord = (req, res, next) => {
    // Validate that creation_date is provided
    if (!req.body.creation_date) {
        return res.status(400).json({
            message: "Missing creation_date.",
        });
    }

    const completed = req.body.completed === true || req.body.completed === "true" || req.body.completed === 1;

    const data = {
        challenge_id: req.params.challenge_id,
        user_id: req.body.user_id,
        completed: completed ? 1 : 0, // Convert boolean to integer
        creation_date: req.body.creation_date,
        notes: req.body.notes,
    };

    const insertCallback = (error, results) => {
        if (error) {
            console.error("Error inserting completion record:", error);
            return res.status(500).json({
                message: "Error inserting completion record.",
                error: error
            });
        }

        // Attach data to the request object for the next middleware
        req.challengeData = {
            complete_id: results.insertId,
            challenge_id: data.challenge_id,
            user_id: data.user_id,
            completed: !!data.completed, // Convert back to boolean for further use
            creation_date: data.creation_date,
            notes: data.notes,
        };

        next(); // Pass control to the next middleware
    };

    // Insert the record into UserCompletion table
    model.insertCompletionRecord(data, insertCallback);
};

//Update Skillpoints
// module.exports.updateSkillPoints = (req, res) => {
//     const { user_id, completed } = req.challengeData; // Retrieve data from the previous middleware
//     const awardedSkillpoints = completed ? : 5; // Use 10 points if true, 5 points if false

//     const callback = (error, results) => {
//         if (error) {
//             console.error("Error updating skillpoints:", error);
//             return res.status(500).json({
//                 message: "Error updating skillpoints.",
//                 error: error,
//             });
//         }

//         // Respond with the final result
//         res.status(201).json({
//             ...req.challengeData
//         });
//     };

//     // Update skill points for the user
//     model.updateSkillPoints(user_id, awardedSkillpoints, callback);
// };

module.exports.checkBodyUserIdExists = (req, res, next) => {   
    const data = {
        user_id: req.body.user_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkBodyUserIdExists:", error);
            return res.status(500).json({
                message: "Error checking user ID existence.",
                error: error
            });
        }

        if (results.length === 0) {
            res.status(404).json({
                message: "User Id does not exist"
            });
        } else {
            next();
        }
    };

    model.selectUserId(data, callback);
};

//Check Challenge Record 
module.exports.checkAllChallengeRecords = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id,
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error checkAllChallengeRecords:", error);
            return res.status(500).json({
                message: "Error retrieving challenge records.",
                error: error
            });
        }

        // Check if no records exist for the given challenge_id
        if (!results || results.length === 0) {
            return res.status(404).json({ message: "No user attempts found for the requested challenge_id." });
        }

        // Process results to return in the desired format
        const processedResults = results.map((record) => ({
            user_id: record.user_id,
            completed: Boolean(record.completed), // Ensure completed is a boolean
            creation_date: record.creation_date,
            notes: record.notes,
        }));

        res.status(200).json(processedResults); // Directly return the array
    };

    model.checkRecords(data, callback);
};



  
  //updateUserSkillpointsAndRespond
module.exports.updateUserSkillpointsAndRespond = (req, res) => {
    const { user_id } = req.body;
    const { completionId, awardedSkillpoints } = req;
  
    // Ensure completed is explicitly parsed as a boolean
    const completed = req.body.completed === "true" || req.body.completed === true;
  
    const data = {
      user_id,
      skillpoints: awardedSkillpoints,
    };
  
    const callback = (error) => {
      if (error) {
        console.error("Error in updateUserSkillpoints:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
  
      res.status(201).json({
        complete_id: completionId,
        challenge_id: req.params.challenge_id,
        user_id,
        completed, // Return the parsed boolean value
        creation_date: req.body.creation_date,
        notes: req.body.notes,
      });
    };
  
    model.updateUserSkillpoints(data, callback);
  };//createCompletionRecord
  module.exports.createCompletionRecord = (req, res, next) => {
    const { challenge_id } = req.params;
    const { user_id, completed, creation_date, notes } = req.body;
    const { skillpoints } = req.challenge;
  
    // Ensure completed is explicitly parsed as a boolean
    const isCompleted = completed === "true" || completed === true;
  
    // Award 5 skill points if completed is false
    const awardedSkillpoints = isCompleted ? skillpoints : 5;
  
    const data = {
      challenge_id,
      user_id,
      completed: isCompleted ? 1 : 0, // Convert boolean to 1/0 for database
      creation_date,
      notes,
      skillpoints_awarded: awardedSkillpoints, // Include awarded skill points
    };
  
    const callback = (error, results) => {
      if (error) {
        console.error("Error in insertCompletionRecord:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
  
      req.completionId = results.insertId;
      req.awardedSkillpoints = awardedSkillpoints;
      next();
    };
  
    model.insertCompletionRecord(data, callback);
  };