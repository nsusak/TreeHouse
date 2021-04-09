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
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const tree = new Tree({
            author: "60111fa5f31387008f16fcb4",
            location: `${cities[random1000].city}, ${cities[random1000].country}`,
            name: `${sample(descriptors)} ${sample(names)}`,
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam vero aliquam cupiditate dolores nisi reprehenderit voluptatum voluptatem error illum mollitia, sit expedita dicta atque doloremque soluta doloribus? Eum, laborum. Provident?",
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].lng,
                cities[random1000].lat,]
            },
            images: [
                {
                    url: "https://res.cloudinary.com/dots4dzl7/image/upload/v1612035738/TreeHouse/b9rofhbvm0hvutmww0pa.jpg",
                    filename: "TreeHouse/ijaezhxnkyki0f88k0kh"
                },
                {
                    url: "https://res.cloudinary.com/dots4dzl7/image/upload/v1612035814/TreeHouse/kfjogtxi37bpeotfbkga.jpg",
                    filename: "TreeHouse/hacc8x4qur2fbeobyfhy"
                },
                {
                    url: "https://res.cloudinary.com/dots4dzl7/image/upload/v1612035826/TreeHouse/z2j1ktandsa9iwarulkn.jpg",
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