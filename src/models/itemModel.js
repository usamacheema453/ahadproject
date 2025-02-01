const pool = require("../services/db");

module.exports.fetchAllItems = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Shop;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.fetchItemById = (item_id, callback) => {
    const SQLSTATEMENT = `
        SELECT item_id, item_name, effect_happiness, price
        FROM Shop
        WHERE item_id = ?;
    `;
    pool.query(SQLSTATEMENT, [item_id], callback);
};
