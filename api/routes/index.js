var express = require("express");
var router = express.Router();

var allHotels = require("../controllers/hotelsController");
var allReviews = require("../controllers/reviewController");

router
    .route("/hotels")
    .get(allHotels.hotelsGetAll);

router
    .route("/hotels/:hotelID")
    .get(allHotels.hotelsGetOne);

router
    .route("/hotels/new")
    .post(allHotels.hotelsAddOne);

    
// routes for reviews
router
    .route("/hotels/:hotelID/reviews")
    .get(allReviews.reviewsGetAll);

router  
    .route("/hotels/:hotelID/reviews/:reviewID")
    .get(allReviews.reviewsGetOne);

module.exports = router;