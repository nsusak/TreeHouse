const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TreeSchema = new Schema({
    name: String,
    image: String,
    description: String,
    location: String
});

module.exports = mongoose.model("Tree", TreeSchema);