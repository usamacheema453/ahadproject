const model = require('../models/userModel.js');

// Create User by Username
module.exports.createUser = (req, res, next) => {
    if (req.body.username === undefined) {
        res.status(400).send({ message: "Missing Username" });
        return;
    }

    const data = {
        username: req.body.username,
        skillpoints: 0
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createUser:", error);
            return res.status(500).json({
                message: "Error creating user.",
                error: error
            });
        }

        res.status(201).json({
            user_id: results.insertId,
            username: req.body.username,
            skillpoints: data.skillpoints
        });                
    };

    model.insertSingle(data, callback);
};

// Check User Exists
module.exports.checkUserExist = (req, res, next) => {   
    const data = {
        username: req.body.username
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserExist:", error);
            return res.status(500).json({
                message: "Error checking user existence.",
                error: error
            });
        }

        if (results.length > 0) {
            res.status(409).json({
                message: "Username already exists"
            });
        } else {
            next();
        }
    };

    model.selectUser(data, callback);
};



// Get all Users
module.exports.readAllUsers = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllUsers:", error);
            return res.status(500).json({
                message: "Error retrieving users.",
                error: error
            });
        }

        res.status(200).json(results);
    };

    model.selectAllUsers(callback);
};

module.exports.getUserbyUserId = (req, res, next) => {
    const userId = req.params.user_id; // Extract user_id from request params

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error retrieving user:", error);
            return res.status(500).json({
                message: "Error retrieving user.",
                error: error
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json(results[0]); // Return the first user result
    };

    model.selectUserId({ user_id: userId }, callback); // Pass user_id to selectUserId
};

// Check User Id exists 
module.exports.checkUserIdExists = (req, res, next) => {   
    const data = {
        user_id: req.params.user_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserIdExists:", error);
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

// Update User By Id 
module.exports.updateUserById = (req, res, next) => {
    if (req.body.username === undefined || req.body.skillpoints === undefined) {
        res.status(400).json({
            message: "Error: Missing required data"
        });
        return;
    }

    const data = {
        user_id: req.params.user_id,
        username: req.body.username,
        skillpoints: req.body.skillpoints
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateUserById:", error);
            return res.status(500).json({
                message: "Error updating user.",
                error: error
            });
        }

        res.status(200).json({
            user_id: Number(data.user_id),
            username: data.username,
            skillpoints: Number(data.skillpoints)
        }); 
    };

    model.updateById(data, callback);
};

//validateRequestAndUser
module.exports.validateRequestAndUser = (req, res, next) => {
    const { user_id, creation_date } = req.body;
  
    if (!user_id) {
      return res.status(400).json({
        message: "user_id is required in the request body.",
      });
    }
  
    if (!creation_date) {
      return res.status(400).json({
        message: "creation_date is required in the request body.",
      });
    }
  
    const data = { user_id };
  
    const callback = (error, results) => {
      if (error) {
        console.error("Error in selectUserByUserId:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (results.length == 0) {
        return res.status(404).json({ message: "User not found" });
      }
      next();
    };
  
    model.selectUserByUserId(data, callback);
  };


  module.exports.getLeaderboard = (req, res) => {
    const callback = (error, results) => {
        if (error) {
            console.error("Error getLeaderboard:", error);
            return res.status(500).json({
                message: "Error retrieving leaderboard.",
                error: error
            });
        }
    
        console.log("Leaderboard Query Results:", results); // Log results here
        // Process and send the response
        const formattedResults = results.map((row, index) => ({
            id: row.user_id,
            name: row.username,
            coins: row.skillpoints || 0, // Skillpoints as coins
            // Add any other data mappings here
        }));
    
        res.status(200).json(formattedResults);
    };
    

    model.selectLeaderboard(callback); // Call the database model
};


// Update User Skillpoints
module.exports.updateUserSkillpoints = (req, res) => {
    const { user_id } = req.params;
    const { skillpoints } = req.body;

    if (!skillpoints || isNaN(skillpoints)) {
        return res.status(400).json({ message: "Skillpoints value is required and must be a number." });
    }

    const data = {
        user_id,
        skillpoints
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error updateUserSkillpoints:", error);
            return res.status(500).json({
                message: "Error updating skillpoints.",
                error: error
            });
        }

        res.status(200).json({
            message: "Skillpoints updated successfully!",
            user_id: Number(user_id),
            updated_skillpoints: Number(skillpoints)
        });
    };

    model.updateSkillpoints(data, callback);
};


// Reset Leaderboard (Admin Only)
module.exports.resetLeaderboard = (req, res) => {
    const callback = (error, results) => {
        if (error) {
            console.error("Error resetLeaderboard:", error);
            return res.status(500).json({
                message: "Error resetting leaderboard.",
                error: error
            });
        }

        res.status(200).json({
            message: "Leaderboard reset successfully.",
            affectedRows: results.affectedRows
        });
    };

    model.resetAllSkillpoints(callback);
};

module.exports.validateAdmin = (req, res, next) => {
    const { user_id } = req.body; // Assuming user_id is passed in the request body

    if (!user_id) {
        return res.status(400).json({ message: "Missing user_id." });
    }

    // Query the database to check if the user is an admin
    const data = { user_id };
    const callback = (error, results) => {
        if (error) {
            console.error("Error validating admin:", error);
            return res.status(500).json({ message: "Internal Server Error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const user = results[0];
        if (user.is_admin !== 1) {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        // If user is admin, proceed to the next middleware or route handler
        next();
    };

    // Call your model function to check admin status
    model.selectUserById(data, callback); // Assumes you have a `selectUserById` function in your model
};

module.exports.login = (req, res, next) => {
    try { 
        const requiredFields = ['username', 'password'];

        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === "") {
                res.status(400).json({ message: `${field} is undefined or empty` });
                return;
            }
        };

        const data = {
            username: req.body.username,
            password: res.locals.hash
        };

        const callback = (error, results) => {
            if(error){
                console.error("Error login callback: ", error);
                res.status(500).json(error);
            } else {
                if(results.length == 0){
                    res.status(404).json({message: "User not found"}); 
                } else {
                    res.locals.userId = results[0].id
                    res.locals.hash = results[0].password
                    next();
                }
            }
        };

        model.login(data, callback);

    } catch (error) {
        console.error("Error login: ", error);
        res.status(500).json(error);
    }
};
module.exports.register = (req, res, next) => {
    try { 
        const data = {
            email: req.body.email,
            username: req.body.username,
            password: res.locals.hash
        };

        const callback = (error, results) => {
            if(error){
                console.error("Error register callback: ", error);
                res.status(500).json(error);
            } else {
                next();
            }
        };

        model.register(data, callback);

    } catch (error) {
        console.error("Error register: ", error);
        res.status(500).json(error);
    }
};
module.exports.checkUsernameOrEmailExist = (req, res, next) => {
    try {
        const requiredFields = ['username', 'email'];

        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === "") {
                res.status(400).json({ message: `${field} is undefined or empty` });
                return;
            }
        };
    
        const data = {
            email: req.body.email,
            username: req.body.username
        };

        const callback = (error, results) => {
            if(error){
                console.error("Error readUserByEmailAndUsername callback: ", error);
                res.status(500).json(error);
            } else {
                if(results[1].length != 0 || results[0].length != 0){
                    res.status(409).json({message: "Username or email already exists"});
                } else {
                    next();
                }
            }
        };

        model.readUserByEmailAndUsername(data, callback);

    } catch (error) {
        console.error("Error readUserByEmailAndUsername: ", error);
        res.status(500).json(error);
    }

};