const pool = require("../services/db");
module.exports.addToInventory = (user_id, item_id, quantity, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Inventory (user_id, item_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + ?;
    `;
    pool.query(SQLSTATEMENT, [user_id, item_id, quantity, quantity], callback);
};

module.exports.getUserItem = (user_id, item_id, callback) => {
    const SQLSTATEMENT = `
        SELECT i.quantity, s.item_name, s.effect_happiness
        FROM Inventory i
        INNER JOIN Shop s ON i.item_id = s.item_id
        WHERE i.user_id = ? AND i.item_id = ?;
    `;
    pool.query(SQLSTATEMENT, [user_id, item_id], callback);
};


module.exports.reduceItemQuantity = (user_id, item_id, callback) => {
    const SQLSTATEMENT = `
        UPDATE Inventory
        SET quantity = quantity - 1
        WHERE user_id = ? AND item_id = ? AND quantity > 0;
    `;
    pool.query(SQLSTATEMENT, [user_id, item_id], callback);
};
