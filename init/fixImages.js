const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const seedImageMap = new Map(
  initData.data.map((item) => [
    `${item.title}||${item.location}||${item.country}`,
    item.image,
  ])
);

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  const listings = await Listing.find({});
  let updatedCount = 0;

  for (const listing of listings) {
    const hasImage =
      listing.image &&
      typeof listing.image === "object" &&
      typeof listing.image.url === "string" &&
      listing.image.url.trim() !== "";

    if (hasImage) {
      continue;
    }

    const key = `${listing.title}||${listing.location}||${listing.country}`;
    const imageUrl = seedImageMap.get(key);

    if (!imageUrl) {
      continue;
    }

    listing.image = {
      url: imageUrl,
      filename: "seed-image",
    };

    await listing.save();
    updatedCount += 1;
  }

  console.log(`Updated ${updatedCount} listings with image URLs.`);
  await mongoose.connection.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
