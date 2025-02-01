const pool = require("../services/db");

// Model to adopt a pet
module.exports.adoptPet = (user_id, pet_id, callback) => {
    const SQL = `
        INSERT INTO UserPets (user_id, pet_id)
        VALUES (?, ?);
    `;
    pool.query(SQL, [user_id, pet_id], callback);
};

// Model to get all pets owned by a user
module.exports.getUserPets = (user_id, callback) => {
    const SQL = `
        SELECT 
            UserPets.user_pet_id, 
            Pets.pet_name, 
            Pets.species, 
            UserPets.happiness_level, 
            UserPets.purchase_date 
        FROM UserPets
        INNER JOIN Pets ON UserPets.pet_id = Pets.pet_id
        WHERE UserPets.user_id = ?;
    `;
    pool.query(SQL, [user_id], callback);
};

// Model to update happiness level
module.exports.updateHappinessLevel = (user_pet_id, happiness_level, callback) => {
    const SQL = `
        UPDATE UserPets
        SET happiness_level = ?
        WHERE user_pet_id = ?;
    `;
    pool.query(SQL, [happiness_level, user_pet_id], callback);
};

// Model to release a pet
module.exports.releasePet = (user_pet_id, callback) => {
    const SQL = `
        DELETE FROM UserPets
        WHERE user_pet_id = ?;
    `;
    pool.query(SQL, [user_pet_id], callback);
};
