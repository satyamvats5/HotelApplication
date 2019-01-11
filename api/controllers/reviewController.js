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

var _addReview = function(req, res, hotel) {
    hotel.reviews.push({
        name: req.body.name,
        rating: parseInt(req.body.rating, 10),
        review: req.body.review
    });
    hotel.save(function(err, UpdatedHotel){
        if(err) {
            res 
                .status(500)
                .json(err)
        } else {
            console.log(UpdatedHotel, UpdatedHotel.reviews.length)
            res
                .status(201) 
                .json(UpdatedHotel.reviews[UpdatedHotel.reviews.length - 1]);
        }
    }); 

};

module.exports.reviewsAddOne = function(req, res) {
    var hotelID = req.params.hotelID;
    hotel
        .findById(hotelID)
        .select('reviews')
        .exec(function(err, doc) {
            var response = {
                status: 200,
                message: []
            };
            if(err) {
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    "message": "Hotel id not found in data base : " + hotelID 
                };
            } 
            if(doc) {
                _addReview(req, res, doc);
            } else {
            res    
                .status(response.status)
                .json(response.message);
            }
        });
};

module.exports.reviewsUpdateOne = function(req, res) {
    var hotelID = req.params.hotelID;
    var reviewID = req.params.reviewID;
    hotel
        .findById(hotelID)
        .select('reviews')
        .exec(function(err, doc) {
            var curReview;
            var response = {
                status: 200,
                message: []
            };
            if(err) {
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    "message": "Hotel-ID not found in database: " + hotelID
                };
            }
            curReview = doc.reviews.id(reviewID);
            if(response.status != 200) {
                res
                    .status(response.status)
                    .json(response.message);
            } else {
                curReview.name = req.body.name;
                curReview.rating = parseInt(req.body.rating, 10);
                curReview.review = req.body.review;
                doc.save(function(err, updatedHotel) {
                    if(err) {
                        res 
                            .status(500)
                            .json(err);
                    } else {
                        res
                            .status(204)
                            .json();
                    }
                });
            }
        });
};
