const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');

// Post a review
router.post(
    '/users/:user_id/',
    reviewController.validateReviewInput,           // Validate input fields
    reviewController.validateUserExistence,          // Validate user existence
    reviewController.validateChallengeExistence, // Validate challenge existence
    reviewController.checkDuplicateReview,         // Check for duplicate review
    reviewController.postReview                    // Post review controller
);

// Update a review
router.put(
    "/:review_id/users/:user_id",
    reviewController.validateUpdateReviewInput,  // Validate input fields
    reviewController.validateReviewOwnership,   // Validate review ownership
    reviewController.updateReview               // Update review controller
);

// Delete a review
router.delete(
    "/:review_id/users/:user_id",
    reviewController.validateReviewOwnership,  // Validate review ownership
    reviewController.deleteReview             // Delete review controller
);

//Get reviews
router.get(
    "/challenge/:challenge_id",
    reviewController.validateChallengeExistence, // Validate challenge existence
    reviewController.getAllReviews                 // Fetch all reviews controller
);

module.exports = router;

