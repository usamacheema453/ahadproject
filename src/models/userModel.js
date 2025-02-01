const pool = require('../services/db');

//Get all Users
module.exports.selectAllUsers = (callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM User;
    `;
    pool.query(SQLSTATEMENT, callback);
};


//Check User 
module.exports.selectUser = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM User
        WHERE username = ?;
        `;
        const VALUES = [data.username];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }
    

//Create user
module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO User (username, skillpoints)
    VALUES (?, ?);
    `;
    const VALUES = [data.username, data.skillpoints]; 
    pool.query(SQLSTATEMENT, VALUES, callback);
};
//Update User by userid
module.exports.updateById = (data, callback) =>
    {
        const SQLSTATMENT = `
        UPDATE User 
        SET username = ?, skillpoints = ?
        WHERE user_id = ?;
        `;
        const VALUES = [data.username, data.skillpoints, data.user_id];
    
        pool.query(SQLSTATMENT, VALUES, callback);

    
    }


//Select User Id
module.exports.selectUserId = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM User
        WHERE user_id = ?;
        `;
        const VALUES = [data.user_id];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }





    module.exports.checkUserExistence = (user_id, callback) => {
        const SQLSTATEMENT = `
            SELECT * FROM User
            WHERE user_id = ?;
        `;
        const VALUES = [user_id];
    
        pool.query(SQLSTATEMENT, VALUES, callback);
    };
    


//selectUserByUserId
module.exports.selectUserByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM User 
        WHERE user_id = ?;
    `;
    const VALUES = [data.user_id];
  
    pool.query(SQLSTATEMENT, VALUES, callback);
  };

  module.exports.fetchUserSkillpoints = (user_id, callback) => {
    const SQLSTATEMENT = `
        SELECT skillpoints FROM User WHERE user_id = ?;
    `;
    pool.query(SQLSTATEMENT, [user_id], callback);
};

module.exports.deductSkillpoints = (user_id, amount, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET skillpoints = skillpoints - ?
        WHERE user_id = ? AND skillpoints >= ?;
    `;
    pool.query(SQLSTATEMENT, [amount, user_id, amount], callback);
};

module.exports.getUserById = (user_id, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id
        FROM User
        WHERE user_id = ?;
    `;
    pool.query(SQLSTATEMENT, [user_id], callback);
};
module.exports.getUserAdminById = (user_id, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, is_admin
        FROM User
        WHERE user_id = ?;
    `;
    pool.query(SQLSTATEMENT, [user_id], callback);
};

// Select Leaderboard
module.exports.selectLeaderboard = (callback) => {
    const SQL = `
        SELECT 
            user_id AS id, 
            username AS name, 
            skillpoints
        FROM User
        WHERE skillpoints IS NOT NULL
        ORDER BY skillpoints DESC
        LIMIT 10;
    `;

    pool.query(SQL, callback);
};


// Update Skillpoints for a User
module.exports.updateSkillpoints = (data, callback) => {
    const SQL = `
        UPDATE User
        SET skillpoints = skillpoints + ?
        WHERE user_id = ?;
    `;
    pool.query(SQL, [data.skillpoints, data.user_id], callback);
};

// Reset All Skillpoints to Zero
module.exports.resetAllSkillpoints = (callback) => {
    const SQL = `
        UPDATE User
        SET skillpoints = 0;
    `;
    pool.query(SQL, callback);
};


module.exports.selectUserById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, username, is_admin 
        FROM Users
        WHERE user_id = ?;
    `;
    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
module.exports.login = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT *
        FROM User
        WHERE username = ?;
    `;

    VALUES = [data.username];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.register = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO User (username, email, password)
        VALUES (?, ?, ?);
    `;

    VALUES = [data.username, data.email, data.password];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.readUserByEmailAndUsername = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT User.email
        FROM User
        WHERE email = ?;

        SELECT User.username
        FROM User
        WHERE username = ?;
    `;

    VALUES = [data.email, data.username];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
