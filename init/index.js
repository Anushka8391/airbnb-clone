const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log("err");
});    

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        image: typeof obj.image === "string" ? { url: obj.image, filename: "seed-image" } : obj.image,
        owner: "64a1c8e5f0b9c9b1d8e4c3a2"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();
