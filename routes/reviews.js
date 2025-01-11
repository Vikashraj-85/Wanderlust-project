const express = require('express')
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapFunction.js'); //---> we will use use this function as middle ware to handle our Errors.
const { isLoggedIn ,isAuthor,reviewValidate} = require('../middleware.js');
// controller
const reviewController=require('../controller/reviews.js');


// review
// * Post route
router.post("/",isLoggedIn, reviewValidate, wrapAsync(reviewController.postReview));

// deleting revies --------------------------------->
router.delete('/:reviewId',isLoggedIn,isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;