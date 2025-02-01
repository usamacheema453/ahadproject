const pool = require('../services/db');

//Insert Challenge
module.exports.insertChallenge = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO FitnessChallenge (challenge, creator_id, skillpoints)
        VALUES (?, ?, ?);
    `;
    const VALUES = [data.challenge, data.creator_id, data.skillpoints];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


//Check Challenge Id 
module.exports.selectChallengeId = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM FitnessChallenge
        WHERE challenge_id = ?;
        `;
        const VALUES = [data.challenge_id];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }


//Check Association 
module.exports.selectAssociation = (data, callback) =>
    {
        const SQLSTATMENT = `
         SELECT u.user_id, f.creator_id
        FROM fitnesschallenge f, user u
        WHERE f.creator_id = u.user_id
          AND f.creator_id = ?
          AND f.challenge_id = ?;
        `;
        const VALUES = [ data.user_id,data.challenge_id];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }


//Get all Challenges
module.exports.selectAllChallenge= (callback) => {
    const SQLSTATEMENT = `
    SELECT challenge_id, challenge, creator_id, skillpoints FROM FitnessChallenge;
    `;
    pool.query(SQLSTATEMENT, callback);
};


//Update Challenge By Id 
module.exports.updateChallengesById = (data, callback) => {
    const SQLSTATMENT = `
        UPDATE FitnessChallenge
        SET challenge = ?, creator_id = ?, skillpoints = ?
        WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge, data.creator_id, data.skillpoints, data.challengeId];

    pool.query(SQLSTATMENT, VALUES, callback);
};


//Delete By Id 
module.exports.deleteById = (data, callback) =>
    {
        const SQLSTATMENT = `
        DELETE FROM FitnessChallenge 
        WHERE challenge_id = ?;
        ALTER TABLE FitnessChallenge AUTO_INCREMENT = 1;
        `;
        const VALUES = [data.challenge_id];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }

    //checkChallengeExists - selectChallengeByChallengeId
module.exports.selectChallengeByChallengeId = (challenge_id, callback) => {
    const SQLSTATEMENT = `
      SELECT challenge_id, creator_id, challenge, skillpoints
      FROM FitnessChallenge
      WHERE challenge_id = ?;
    `;
    const VALUES = [challenge_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
  };

  
module.exports.getChallengeById = (challenge_id, callback) => {
    const SQLSTATEMENT = `
        SELECT challenge_id
        FROM FitnessChallenge
        WHERE challenge_id = ?;
    `;
    pool.query(SQLSTATEMENT, [challenge_id], callback);
};