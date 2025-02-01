const pool = require("../services/db");

module.exports.fetchPetCost = (pet_name, species, callback) => {
    const SQLSTATEMENT = `
        SELECT cost_in_skillpoints
        FROM Pets
        WHERE pet_name = ? AND species = ?;
    `;
    const VALUES = [pet_name, species];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// Deduct skill points
module.exports.deductSkillPoints = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET skillpoints = skillpoints - ?
        WHERE user_id = ? AND skillpoints >= ?;
    `;
    const VALUES = [data.cost_in_skillpoints, data.user_id, data.cost_in_skillpoints];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Create a new pet
module.exports.createPet = (data, callback) => {
    const SQL = `
        INSERT INTO Pets (pet_name, species, happiness_level, cost_in_skillpoints)
        VALUES (?, ?, 0, ?);
    `;
    pool.query(SQL, [data.pet_name, data.species, data.cost_in_skillpoints], callback);
};


// Fetch all pets for a user
module.exports.getPetsByUserId = (user_id, callback) => {
    const SQLSTATEMENT = `
        SELECT pet_id, pet_name, species, level, happiness_level
        FROM Pets
        WHERE user_id = ?;
    `;
    pool.query(SQLSTATEMENT, [user_id], callback);
};

// Fetch a specific pet by ID
module.exports.getPetById = (pet_id, callback) => {
    const SQLSTATEMENT = `
        SELECT pet_id, user_id, pet_name, species, level, happiness_level
        FROM Pets
        WHERE pet_id = ?;
    `;
    pool.query(SQLSTATEMENT, [pet_id], callback);
};

// Update pet details by ID
module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Pets 
        SET pet_name = ?, species = ?
        WHERE pet_id = ?;
    `;
    const VALUES = [data.pet_name, data.species, data.pet_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deletePetById = (pet_id, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Pets 
        WHERE pet_id = ?;
    `;
    pool.query(SQLSTATEMENT, [pet_id], callback);
};

// Update pet happiness
module.exports.setPetHappiness = (pet_id, newHappiness, callback) => {
    const SQLSTATEMENT = `
        UPDATE Pets
        SET happiness_level = ?
        WHERE pet_id = ?;
    `;
    const VALUES = [newHappiness, pet_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.getAllPets = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Pets
    `;

    pool.query(SQLSTATEMENT, (error, results) => {
        if (error) {
            return callback(error, null); // Return the error to the callback if there's an issue
        }
        callback(null, results); // Return the results to the callback
    });
};
module.exports.fetchPetById = (pet_id, callback) => {
    const SQL = `
        SELECT *
        FROM Pets
        WHERE pet_id = ?;
    `;
    pool.query(SQL, [pet_id], callback);
};

module.exports.assignPetToUser = (user_id, pet_id, callback) => {
    const SQL = `
        INSERT INTO UserPets (user_id, pet_id, happiness_level)
        VALUES (?, ?, 0); -- Initialize happiness_level to 0
    `;
    pool.query(SQL, [user_id, pet_id], callback);
};
