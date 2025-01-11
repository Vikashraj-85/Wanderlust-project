const Listing = require('../models/listing.js');
const Review = require("../models/review.js");
module.exports.postReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // -------after login----
    newReview.author=req.user._id;
   
    // --------ending abobe line
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log('review savedd.');
    res.redirect(`/listings/${req.params.id}`);
};
module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
 
    // when user is loggedIn----
    //  let findreview=  await Review.findById(reviewId);
    // // checking if review or deleter are same or not
    // if(!findreview.author._id.equals(res.locals.currUser._id)){
    //     req.flash('error','This review is not posted by you.');
    //   return  res.redirect(`/listings/${id}`);
    // }
    // --ending-------

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);

}