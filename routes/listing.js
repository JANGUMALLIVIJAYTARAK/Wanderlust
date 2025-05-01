const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})
// const upload = multer({ dest: 'uploads/' });

//index and create route in one
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);


// //Index Route 
// router.get("/",wrapAsync(listingController.index));
// //Create Route..
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing)
// );

//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//show,update,delete routes...
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destoryListing));


//Show route
// router.get("/:id",wrapAsync(listingController.showListing));

//Update Route
// router.put("/:id",isOwner,isLoggedIn,validateListing,wrapAsync(listingController.updateListing));

//Delete Route
// router.delete("/:id",isOwner,isLoggedIn,wrapAsync(listingController.destoryListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



module.exports = router;