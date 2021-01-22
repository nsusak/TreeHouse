const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Tree = require("./models/tree");

mongoose.connect("mongodb://localhost:27017/treeHouse", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console.error, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/trees", async (req, res) => {
    const trees = await Tree.find({});
    res.render("trees/index", { trees })
})

app.get("/trees/new", (req, res) => {
    res.render("trees/new")
})

app.post("/trees", async (req, res) => {
    const tree = new Tree(req.body.tree);
    await tree.save();
    res.redirect(`/trees/${tree._id}`)
})

app.get("/trees/:id", async (req, res) => {
    const tree = await Tree.findById(req.params.id)
    res.render("trees/show", { tree })
})

app.get("/trees/:id/edit", async (req, res) => {
    const tree = await Tree.findById(req.params.id)
    res.render("trees/edit", { tree })
})

app.put("/trees/:id", async (req, res) => {
    const { id } = req.params;
    const tree = await Tree.findByIdAndUpdate(id, { ...req.body.tree });
    res.redirect(`/trees/${tree._id}`)
})

app.delete("/trees/:id", async (req, res) => {
    const { id } = req.params;
    await Tree.findByIdAndDelete(id);
    res.redirect("/trees");
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})