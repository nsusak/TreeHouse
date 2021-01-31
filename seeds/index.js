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
            author: "60111fa5f31387008f16fcb4",
            location: `${cities[random1000].city}, ${cities[random1000].country}`,
            name: `${sample(descriptors)} ${sample(names)}`,
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam vero aliquam cupiditate dolores nisi reprehenderit voluptatum voluptatem error illum mollitia, sit expedita dicta atque doloremque soluta doloribus? Eum, laborum. Provident?",
            images: [
                {
                    url: "https://res.cloudinary.com/dots4dzl7/image/upload/v1612032977/TreeHouse/ijaezhxnkyki0f88k0kh.jpg",
                    filename: "TreeHouse/ijaezhxnkyki0f88k0kh"
                },
                {
                    url: "https://res.cloudinary.com/dots4dzl7/image/upload/v1612032977/TreeHouse/hacc8x4qur2fbeobyfhy.jpg",
                    filename: "TreeHouse/hacc8x4qur2fbeobyfhy"
                },
                {
                    url: "https://res.cloudinary.com/dots4dzl7/image/upload/v1612032977/TreeHouse/linhpcxbprrrbvxjvlcj.jpg",
                    filename: "TreeHouse/linhpcxbprrrbvxjvlcj"
                }
            ]
        })
        await tree.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})