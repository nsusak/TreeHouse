const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const Tree = require("../models/tree");
const { reviewSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async (req, res) => {
    const tree = await Tree.findById(req.params.id);
    const review = new Review(req.body.review);
    tree.reviews.push(review);
    await review.save();
    await tree.save();
    req.flash("success", "Created new review!")
    res.redirect(`/trees/${tree._id}`);
}))

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Tree.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Successfully deleted a review!")
    res.redirect(`/trees/${id}`)
}))

module.exports = router;