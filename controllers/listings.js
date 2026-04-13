const path = require("path");
const dotenv = require("dotenv");
const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60";
const envConfig = dotenv.config({ path: path.join(__dirname, "..", ".env") });

const getMapToken = () => {
  if (process.env.MAP_TOKEN) {
    return process.env.MAP_TOKEN;
  }

  if (envConfig.parsed && envConfig.parsed.MAP_TOKEN) {
    return envConfig.parsed.MAP_TOKEN;
  }

  return "";
};

const geocodingClient = mbxGeocoding({ accessToken: getMapToken() });

const getImageUrl = (image) => {
  if (typeof image === "string" && image.trim() !== "") {
    return image;
  }

  if (image && typeof image === "object" && typeof image.url === "string" && image.url.trim() !== "") {
    return image.url;
  }

  return DEFAULT_IMAGE_URL;
};

const normalizeListingImage = (listing) => {
  if (!listing) {
    return listing;
  }

  listing.imageUrl = getImageUrl(listing.image);
  return listing;
};

const normalizeListingsImage = (listings) => listings.map((listing) => normalizeListingImage(listing));

module.exports.index=async(req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  normalizeListingsImage(allListings);
  res.render("listings/index.ejs", {allListings});
}


module.exports.renderNewForm=(req, res) => {
    
     res.render("listings/new.ejs");
    
};

module.exports.showListing=async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        return res.redirect("/listings");
    }
    const currentUser = req.user || null;
    const isListingOwner = Boolean(
      currentUser &&
      listing.owner &&
      String(currentUser._id) === String(listing.owner._id)
    );
    normalizeListingImage(listing);
    res.render("listings/show.ejs", {
      listing,
      currentUser,
      isListingOwner,
      mapToken: getMapToken(),
    });
};


// module.exports.createListing=async(req, res, next) => {
//   let response = await geocodingClient.forwardGeocode({
//     query:`${req.body.listing.location}, ${req.body.listing.country}`,
//     limit:1,
//   }).send();
 
//     let url=req.file.path;
//     let filename=req.file.filename;
//     const newListing = new Listing(req.body.listing);
//     newListing.owner=req.user._id;
//     newListing.image={url,filename};
//     newListing.geometry = response.body.features.length
//       ? response.body.features[0].geometry
//       : { type: "Point", coordinates: [77.209, 28.6139] };
//     let savedListing = await newListing.save();
//     console.log(savedListing);

//     req.flash("success","New Listing created")
//     res.redirect("/listings");
// };

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: `${req.body.listing.location}, ${req.body.listing.country}`,
    limit: 1,
  }).send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  
  if (response.body.features.length > 0) {
    newListing.geometry = {
      type: "Point",
      coordinates: response.body.features[0].geometry.coordinates,
    };
  } else {
    newListing.geometry = {
      type: "Point",
      coordinates: [77.209, 28.6139], // fallback
    };
  }

  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing created");
  res.redirect("/listings");
};







    

  module.exports.renderEditForm=async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

// module.exports.updateListing=async(req, res) => {
//     let {id} = req.params;
//     let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true, runValidators: true });
//     let response = await geocodingClient.forwardGeocode({
//       query:`${req.body.listing.location}, ${req.body.listing.country}`,
//       limit:1,
//     }).send();
//     if (response.body.features.length > 0) {
//   newListing.geometry = {
//     type: "Point",
//     coordinates: response.body.features[0].geometry.coordinates
//   };
// } else {
//   newListing.geometry = {
//     type: "Point",
//     coordinates: [77.209, 28.6139] // fallback (Delhi)
//   };
// }
// };
    
       
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true, runValidators: true }
  );

  let response = await geocodingClient.forwardGeocode({
    query: `${req.body.listing.location}, ${req.body.listing.country}`,
    limit: 1,
  }).send();

  // ✅ FIX: use listing NOT newListing
  if (response.body.features.length > 0) {
    listing.geometry = {
      type: "Point",
      coordinates: response.body.features[0].geometry.coordinates,
    };
  } else {
    listing.geometry = {
      type: "Point",
      coordinates: [77.209, 28.6139],
    };
  }

  
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async(req, res) => {
    let {id} = req.params;
    let deleatedListing= await Listing.findByIdAndDelete(id);
    console.log(deleatedListing);
  req.flash("success","Listing deleted")
    res.redirect("/listings");

};
