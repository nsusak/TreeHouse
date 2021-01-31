const express = require("express");
const router = express.Router();
const trees = require("../controllers/trees");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateTree, isAuthor } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage })

const Tree = require("../models/tree");

router.route("/")
    .get(catchAsync(trees.index))
    .post(isLoggedIn, upload.array("image"), validateTree, catchAsync(trees.createTree));

router.get("/new", isLoggedIn, trees.renderNewForm);

router.route("/:id")
    .get(catchAsync(trees.showTree))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateTree, catchAsync(trees.updateTree))
    .delete(isLoggedIn, isAuthor, catchAsync(trees.deleteTree));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(trees.renderEditForm));

module.exports = router;