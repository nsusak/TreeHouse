const Tree = require("../models/tree");

module.exports.index = async (req, res) => {
    const trees = await Tree.find({});
    res.render("trees/index", { trees })
}

module.exports.renderNewForm = (req, res) => {
    res.render("trees/new")
}

module.exports.createTree = async (req, res) => {
    const tree = new Tree(req.body.tree);
    tree.author = req.user._id;
    await tree.save();
    req.flash("success", "Successfully made a new tree!");
    res.redirect(`/trees/${tree._id}`)
}

module.exports.showTree = async (req, res) => {
    const tree = await Tree.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!tree) {
        req.flash("error", "Tree not found!");
        return res.redirect("/trees");
    }
    res.render("trees/show", { tree })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const tree = await Tree.findById(id);
    if (!tree) {
        req.flash("error", "Tree not found!");
        return res.redirect("/trees");
    }
    res.render("trees/edit", { tree })
}

module.exports.updateTree = async (req, res) => {
    const { id } = req.params;
    const tree = await Tree.findByIdAndUpdate(id, { ...req.body.tree });
    req.flash("success", "Successfully updated tree!")
    res.redirect(`/trees/${tree._id}`)
}

module.exports.deleteTree = async (req, res) => {
    const { id } = req.params;
    await Tree.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a tree!")
    res.redirect("/trees");
}