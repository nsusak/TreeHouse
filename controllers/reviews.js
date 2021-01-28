const Tree = require("../models/tree");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const tree = await Tree.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    tree.reviews.push(review);
    await review.save();
    await tree.save();
    req.flash("success", "Created new review!")
    res.redirect(`/trees/${tree._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Tree.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Successfully deleted a review!")
    res.redirect(`/trees/${id}`)
}