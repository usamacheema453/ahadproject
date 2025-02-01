const model = require('../models/itemModel');

module.exports.getAllItems = (req, res) => {
    const callback = (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error fetching items.", error });
        }
        res.status(200).json({
            message: "Items fetched successfully!",
            items: results
        });
    };

    model.fetchAllItems(callback);
};