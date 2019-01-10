var mongoose = require("mongoose");
var hotel = mongoose.model("Hotel");

module.exports.reviewsGetAll = function(req, res) {
    var hotelID = req.params.hotelID;
    hotel
        .findById(hotelID)
        .select('reviews')
        .exec(function(err, doc) {
            res    
                .status(200)
                .json(doc.reviews);
        });
};

module.exports.reviewsGetOne = function(req, res) {
    var hotelID = req.params.hotelID;
    var reviewID = req.params.reviewID;
    console.log("Get review ID: " + reviewID + " for hotel : " + hotelID);
    hotel  
        .findById(hotelID)
        .select('reviews')
        .exec(function(err, doc) {
            var review = doc.reviews.id(reviewID);
            res
                .status(200)
                .json(review);
        });
};