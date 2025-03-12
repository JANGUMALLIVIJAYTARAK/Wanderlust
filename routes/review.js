const express = require("express");
const router = express.Router({mergeParams : true}); //while resturcturing use this without getting an error;
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//POST REVIEW ROUTE



router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));
    
    
    // Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

    module.exports = router;