const Tree = require("../models/tree");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const trees = await Tree.find({});
    res.render("trees/index", { trees })
}

module.exports.renderNewForm = (req, res) => {
    res.render("trees/new")
}

module.exports.createTree = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.tree.location,
        limit: 1
    }).send()
    const tree = new Tree(req.body.tree);
    tree.geometry = geoData.body.features[0].geometry;
    tree.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    tree.author = req.user._id;
    await tree.save();
    console.log(tree);
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
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    tree.images.push(...imgs);
    await tree.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await tree.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(tree)
    }
    req.flash("success", "Successfully updated tree!")
    res.redirect(`/trees/${tree._id}`)
}

module.exports.deleteTree = async (req, res) => {
    const { id } = req.params;
    await Tree.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a tree!")
    res.redirect("/trees");
}