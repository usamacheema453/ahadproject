const pool = require("../services/db");

// Insert a new quest
module.exports.createQuest = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Quests (user_id, pet_id, quest, reward, status)
        VALUES (?, ?, ?, ?, ?);
    `;
    const VALUES = [data.user_id, data.pet_id, data.quest, data.reward, data.status];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.getQuestsByUserId = (user_id, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            q.quest_id,
            q.quest,
            q.reward,
            q.status,
            q.pet_id,
            p.pet_name,
            p.species
        FROM Quests q
        JOIN Pets p ON q.pet_id = p.pet_id
        WHERE q.user_id = ?;
    `;
    pool.query(SQLSTATEMENT, [user_id], callback);
};
module.exports.validateQuestOwnership = (user_id, quest_id, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Quests
        WHERE user_id = ? AND quest_id = ?;
    `;
    const VALUES = [user_id, quest_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
module.exports.updateQuestStatus = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Quests
        SET status = ?
        WHERE quest_id = ?;
    `;
    const VALUES = [data.status, data.quest_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
module.exports.addSkillPoints = (user_id, points, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET skillpoints = skillpoints + ?
        WHERE user_id = ?;
    `;
    const VALUES = [points, user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteQuestsByPetId = (pet_id, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Quests 
        WHERE pet_id = ?;
    `;
    pool.query(SQLSTATEMENT, [pet_id], callback);
};