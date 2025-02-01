const pool = require('../services/db');

module.exports.selectUserId = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM User
        WHERE user_id = ?;
        `;
        const VALUES = [data.user_id];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }

    
//Insert Completion Records 
module.exports.insertCompletionRecord = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO UserCompletion (challenge_id, user_id, completed, creation_date, notes)
        VALUES (?, ?, ?, ?, ?);
    `;
    const VALUES = [data.challenge_id, data.user_id, data.completed, data.creation_date, data.notes];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
//Update Skillpoints 
module.exports.updateSkillPoints = (user_id, awardedSkillpoints, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET skillpoints = skillpoints + ?
        WHERE user_id = ?;
    `;
    const VALUES = [awardedSkillpoints, user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};




//Get all challenge records 
module.exports.checkRecords = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT user_id, completed, creation_date, notes
    FROM UserCompletion
    WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.insertCompletionRecord = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO UserCompletion (challenge_id, user_id, completed, creation_date, notes)
        VALUES (?, ?, ?, ?, ?);
    `;
    const VALUES = [
      data.challenge_id,
      data.user_id,
      data.completed,
      data.creation_date,
      data.notes,
    ];
  
    pool.query(SQLSTATEMENT, VALUES, callback);
  };//updateUserSkillpoints
  module.exports.updateUserSkillpoints = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User 
        SET skillpoints = skillpoints + ? 
        WHERE user_id = ?;
    `;
    const VALUES = [data.skillpoints, data.user_id];
  
    pool.query(SQLSTATEMENT, VALUES,callback);
  };