const express = require('express')
const router = express.Router();
// -requireing wrap async
const wrapAsync = require('../utils/wrapFunction.js'); //---> we will use use this function as middle ware to handle our Errors.
// ---------------check user is log in or not----
const { isLoggedIn, isOwner, listingValidate, saveRedirectUrl } = require('../middleware.js');

// ============for MCV===========
const listingController = require('../controller/listings.js');

// ----for storage------
const multer = require('multer');
const {storage}=require('../cloudConfig.js');
// ---------------multer image ------
const upload = multer({ storage });

// showing all listing
router.get("/", wrapAsync(listingController.index));
// adding new list
router.get("/new", isLoggedIn, wrapAsync(listingController.showNew));
// adding to databse 
router.post("/add", isLoggedIn,upload.single('listing[image]'), listingValidate, wrapAsync(listingController.addingToDatabase));

// all  request comes on /:id ,then we use given way to make easy or compact
router.route('/:id')
    .get(wrapAsync(listingController.showInDetail)) // showing in details
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete)) // deleting from db 
    .patch(isLoggedIn, isOwner, upload.single('listing[image]'),listingValidate, wrapAsync(listingController.Update)); // update route  
// get edit rout request
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.getEditrout));

module.exports = router;


