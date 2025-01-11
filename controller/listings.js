const Listing = require('../models/listing.js');

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listing/index.ejs", { allListing });
};
module.exports.showNew = async (req, res) => {
    res.render("./listing/new.ejs");
};

module.exports.addingToDatabase = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    // let {title,description,image,price,location,country}=req.body;
    // console.log(title,description, image,location,country)

    // --or aesy way to store these info given above 
    // let listing=req.body;
    // ---------one more ways
    // * to check validations
    // ------------->  let result=listingSchema.validate(req.body);
    // *checking done
    const newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
    // giving user id to the owner for passport requiring...
    newListing.owner = req.user._id;
    // console.log("--------",req.user._id)    
    newListing.save();
    req.flash('success', ' New listing added successfully.');
    res.redirect("/listings");
};

module.exports.getEditrout = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    //  if user edit invalid listing or post then given below
    if (!listing) {
        req.flash('success', 'Listing doest exist.');
        res.redirect('/listings');
    }
    let originalImageUrl=listing.image.url;
    console.log(originalImageUrl);
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_200");
    console.log(originalImageUrl);

    res.render("./listing/edit.ejs", { listing, originalImageUrl });
};
module.exports.Update = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // for image
    if ( typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }
        await listing.save();
    }
    // -------------end----------
    req.flash('updated', 'listing updated successfully');
    res.redirect("/listings");
};
module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('error', 'listing deleted successfully');
    res.redirect("/listings");
};
module.exports.showInDetail = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: 'reviews', populate: {
            path: 'author'
        },
    }).populate('owner');
    //  if user search invalid listing or post then given below
    if (!listing) {
        req.flash('success', 'Listing doest exist.');
        res.redirect('/listings');
    }

    // --------------
    res.render("./listing/show.ejs", { listing });
};