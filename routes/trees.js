const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { treeSchema } = require("../schemas.js")
const ExpressError = require("../utils/ExpressError");
const Tree = require("../models/tree");
const { isLoggedIn } = require("../middleware");

const validateTree = (req, res, next) => {
    const { error } = treeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get("/", async (req, res) => {
    const trees = await Tree.find({});
    res.render("trees/index", { trees })
})

router.get("/new", isLoggedIn, (req, res) => {
    res.render("trees/new")
})

router.post("/", isLoggedIn, validateTree, catchAsync(async (req, res) => {
    const tree = new Tree(req.body);
    await tree.save();
    req.flash("success", "Successfully made a new tree!");
    res.redirect(`/trees/${tree._id}`)
}))

router.get("/:id", catchAsync(async (req, res) => {
    const tree = await Tree.findById(req.params.id).populate("reviews");
    if (!tree) {
        req.flash("error", "Tree not found!");
        return res.redirect("/trees");
    }
    res.render("trees/show", { tree })
}))

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const tree = await Tree.findById(req.params.id);
    if (!tree) {
        req.flash("error", "Tree not found!");
        return res.redirect("/trees");
    }
    res.render("trees/edit", { tree })
}))

router.put("/:id", validateTree, catchAsync(async (req, res) => {
    const { id } = req.params;
    const tree = await Tree.findByIdAndUpdate(id, { ...req.body.tree });
    req.flash("success", "Successfully updated tree!")
    res.redirect(`/trees/${tree._id}`)
}))

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Tree.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a tree!")
    res.redirect("/trees");
}))

module.exports = router;