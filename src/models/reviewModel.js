const pool = require("../services/db");


module.exports.checkDuplicateReview = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT review_id
        FROM Review
        WHERE user_id = ? AND challenge_id = ? AND deleted = FALSE;
    `;
    const VALUES = [data.user_id, data.challenge_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertReview = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Review (user_id, challenge_id, review, rating)
        VALUES (?, ?, ?, ?);
    `;
    const VALUES = [data.user_id, data.challenge_id, data.review, data.rating];
    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.getReviewById = (review_id, callback) => {
    const SQLSTATEMENT = `
        SELECT review_id, user_id
        FROM Review
        WHERE review_id = ? AND deleted = FALSE;
    `;
    pool.query(SQLSTATEMENT, [review_id], callback);
};
module.exports.updateReview = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Review
        SET review = ?, rating = ?, created_on = CURRENT_TIMESTAMP
        WHERE review_id = ?;
    `;
    const VALUES = [data.review, data.rating, data.review_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};


//Delete

module.exports.softDeleteReview = (review_id, callback) => {
    const SQLSTATEMENT = `
        UPDATE Review
        SET deleted = TRUE
        WHERE review_id = ?;
    `;
    pool.query(SQLSTATEMENT, [review_id], callback);
};

module.exports.getReviewsByChallenge = (challenge_id, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            r.review_id,
            r.review,
            r.rating,
            r.created_on,
            u.username
        FROM Review r
        INNER JOIN User u ON r.user_id = u.user_id
        WHERE r.challenge_id = ? AND r.deleted = FALSE;
    `;

    pool.query(SQLSTATEMENT, [challenge_id], callback); // Let the controller handle results
};