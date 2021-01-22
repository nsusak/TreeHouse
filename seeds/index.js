const mongoose = require('mongoose');
const cities = require("./cities");
const { descriptors, names } = require("./seedHelpers");
const Tree = require("../models/tree");

mongoose.connect('mongodb://localhost:27017/treeHouse', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console.error, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Tree.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const tree = new Tree({
            location: `${cities[random1000].city}, ${cities[random1000].country}`,
            name: `${sample(descriptors)} ${sample(names)}`,
            image: "https://source.unsplash.com/collection/2194927/1600x900",
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam vero aliquam cupiditate dolores nisi reprehenderit voluptatum voluptatem error illum mollitia, sit expedita dicta atque doloremque soluta doloribus? Eum, laborum. Provident?"
        })
        await tree.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})