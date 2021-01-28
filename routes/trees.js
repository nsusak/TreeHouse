const express = require("express");
const router = express.Router();
const trees = require("../controllers/trees");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateTree, isAuthor } = require("../middleware");

router.route("/")
    .get(catchAsync(trees.index))
    .post(isLoggedIn, validateTree, catchAsync(trees.createTree));

router.get("/new", isLoggedIn, trees.renderNewForm);

router.route("/:id")
    .get(catchAsync(trees.showTree))
    .put(isLoggedIn, isAuthor, validateTree, catchAsync(trees.updateTree))
    .delete(isLoggedIn, isAuthor, catchAsync(trees.deleteTree));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(trees.renderEditForm));

module.exports = router;