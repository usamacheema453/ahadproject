const reviewModel = require("../models/reviewModel");
const userModel = require("../models/userModel");
const challengeModel = require("../models/fitnessChallengesModel");


module.exports.validateReviewInput = (req, res, next) => {
    const { user_id } = req.params;
    const { challenge_id, review, rating } = req.body;

    // Check for missing fields
    if (!user_id || !challenge_id || !review || rating === undefined) {
        return res.status(400).json({ message: "Missing required fields: user_id, challenge_id, review, or rating." });
    }

    // Check for empty or whitespace-only review
    if (review.trim() === "") {
        return res.status(400).json({ message: "Review cannot be empty or just whitespace." });
    }

    // Check for valid rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
    }

    next(); // Proceed to the next middleware or controller
};


module.exports.validateUserExistence = (req, res, next) => {
    const { user_id } = req.params;

    userModel.getUserById(user_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error checking user existence.", error });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: `User with ID ${user_id} does not exist.` });
        }

        next(); // User exists, proceed to the next middleware or controller
    });
};

module.exports.validateChallengeExistence = (req, res, next) => {
    const { challenge_id } = req.body;

    challengeModel.getChallengeById(challenge_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error checking challenge existence.", error });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: `Challenge with ID ${challenge_id} does not exist.` });
        }

        next(); // Challenge exists, proceed to the next middleware or controller
    });
};

module.exports.checkDuplicateReview = (req, res, next) => {
    const { user_id } = req.params;
    const { challenge_id } = req.body;

    reviewModel.checkDuplicateReview({ user_id, challenge_id }, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error checking for duplicate reviews.", error });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "You have already posted a review for this challenge." });
        }

        next(); // No duplicate review, proceed to the next middleware or controller
    });
};

module.exports.postReview = (req, res) => {
    const { user_id } = req.params;
    const { challenge_id, review, rating } = req.body;

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error posting review.", error });
        }

        res.status(201).json({
            message: "Review posted successfully!",
            review_id: results.insertId,
            user_id,
            challenge_id,
            review,
            rating,
            created_on: new Date().toISOString(),
        });
    };

    reviewModel.insertReview({ user_id, challenge_id, review, rating }, callback);
};



module.exports.validateUpdateReviewInput = (req, res, next) => {
    const { review, rating } = req.body;

    // Check for missing fields
    if (!review || rating === undefined) {
        return res.status(400).json({ message: "Missing required fields: review or rating." });
    }

    // Check for empty or whitespace-only review
    if (review.trim() === "") {
        return res.status(400).json({ message: "Review cannot be empty or just whitespace." });
    }

    // Check for valid rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
    }

    next(); // Proceed to the next middleware or controller
};
module.exports.validateReviewOwnership = (req, res, next) => {
    const { user_id, review_id } = req.params;

    reviewModel.getReviewById(review_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error validating review ownership.", error });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Review not found." });
        }

        const review = results[0];
        if (review.user_id !== parseInt(user_id, 10)) {
            return res.status(403).json({ message: "You are not authorized to update this review." });
        }

        next(); // User owns the review, proceed
    });
};
module.exports.updateReview = (req, res) => {
    const { user_id, review_id } = req.params;
    const { review, rating } = req.body;

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error updating review.", error });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Review not found or no changes were made." });
        }

        res.status(200).json({ message: "Review updated successfully!" });
    };

    reviewModel.updateReview({ review_id, review, rating }, callback);
};

//Delete 
module.exports.validateReviewOwnership = (req, res, next) => {
    const { user_id, review_id } = req.params;

    reviewModel.getReviewById(review_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error validating review ownership.", error });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Review not found." });
        }

        const review = results[0];
        if (review.user_id !== parseInt(user_id, 10)) {
            return res.status(403).json({ message: "You are not authorized to delete this review." });
        }

        next(); // User owns the review, proceed to delete
    });
};

module.exports.deleteReview = (req, res) => {
    const { review_id } = req.params;

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error deleting review.", error });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Review not found." });
        }

        res.status(200).json({ message: "Review deleted successfully!" });
    };

    reviewModel.softDeleteReview(review_id, callback);
};

//Get all reviews 


module.exports.validateChallengeExistence = (req, res, next) => {
    const { challenge_id } = req.params;

    challengeModel.getChallengeById(challenge_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error validating challenge existence.", error });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: `Challenge with ID ${challenge_id} does not exist.` });
        }

        next(); // Proceed to the controller
    });
};

module.exports.getAllReviews = (req, res) => {
    const { challenge_id } = req.params;

    if (!challenge_id) {
        return res.status(400).json({ message: "Missing required field: challenge_id." });
    }

    reviewModel.getReviewsByChallenge(challenge_id, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error fetching reviews.", error });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No reviews found for this challenge." });
        }

        res.status(200).json(results);
    });
};