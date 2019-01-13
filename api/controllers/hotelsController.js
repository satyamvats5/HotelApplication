var mongoose = require("mongoose");
var hotel = mongoose.model("Hotel");

var geoQuery = function(req, res) {
    var lat = parseFloat(req.query.lat);
    var lng = parseFloat(req.query.lng);

    hotel
        .aggregate( [{
            $geoNear: {
            'near': {'type':'Point', 'coordinates':[lng, lat]},
            'spherical': true,
            'maxDistance': 2000,
            'num':5,
            'distanceField': 'dist' 
            }
        }], function(err, result, stats) {
            var response = {
                "status": 200,
                "message": result
            };

            if(err) {
                response.status = 500;
                response.message = err;
            }  else if(!result) {
                response.status = 404;
                response.message = {
                    "message": "No Data found"
                };
            }
            res 
                .status(response.status)
                .json(response.message);
        });
};


module.exports.hotelsGetAll = function(req, res) {

var offset = 0;
var count = 5;

if(req.query && req.query.lat && req.query.lng) {
    geoQuery(req, res);
    return;
}

if(req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
}

if(req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
}

if(isNaN(offset) || isNaN(count)) {
    res
        .status(400)    //Bas request
        .json({
            "message": "Count and Offset should be of type integer"
        });
    return;
};

hotel
    .find()
    .skip(offset)
    .limit(count)
    .exec(function(err, hotels) {
        if(err) {
            res 
                .status(500)
                .json(err);
        } else {
            console.log("Number of  Hotels found: ", hotels.length);
            res
                .status(200) 
                .json(hotels);
        }
    });
};
//   console.log('GET the hotels');
//   console.log(req.query);

//   collection
//         .find()
//         .skip(offset)
//         .limit(count)
//         .toArray(function(err, docs) { 
//             console.log("Found hotels");
//             res
//                 .status(200)
//                 .json(docs);
//         });

module.exports.hotelsGetOne = function(req, res) {
    // var db_connection = dbconn.get();
    // var db = db_connection.db('meanhotel');
    // var collection = db.collection('hotels');

    var hotelID = req.params.hotelID;

    hotel
        .findById(hotelID)
        .exec(function(err, doc) {
            var response = {
                "status": 200,
                "message": doc
            };
            if(err) {
                response.status = 500;
                response.message = err; 
            } else if(!doc) {
                response.status = 404;
                response.message = {
                        "message": "HotelID not found"
                };
            };
            res
                .status(response.status)
                .json(response.message);
        });
};

var _splitArray = function(input) {
    var output;
    if(input && input.length > 0) {
        output = input.split(";");
    } else {
        output = [];
    }
    return output;
};

module.exports.hotelsAddOne = function(req, res) {
    hotel
        .create({
                name: req.body.name,
                stars: parseInt(req.body.stars, 10),
                services: _splitArray(req.body.services),
                description: req.body.description,
                photos: _splitArray(req.body.photos),
                currency: req.body.currency,
                location: {
                    address: req.body.address,
                    coordinates: [
                        parseFloat(req.body.lng), 
                        parseFloat(req.body.lat)
                    ]
                }
        }, function(err, hotel) {
            if(err) {
                console.log("Error creating hotel");
                res
                    .status(404)
                    .json(err)
            } else {
                console.log("Hotel Created: " + hotel);
                res
                    .status(201)
                    .json(hotel)
            }
        });
};

module.exports.hotelsUpdateOne = function(req, res) {
    var hotelID = req.params.hotelID;
    hotel
        .findById(hotelID)
        .select("-reviews -rooms")
        .exec(function(err, doc) {
            var response ={
                status : 200,
                message: doc
            };
            if(err) {
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    "message": "hotelID not found in the data base"
                }
            }
            if(response.status != 200) {
                res
                    .status(response.status)
                    .json(response.message);
            } else {
                doc.name = req.body.name;
                doc.stars = parseInt(req.body.stars, 10);
                doc.services = _splitArray(req.body.services);
                doc.description = req.body.description;
                doc.photos = _splitArray(req.body.photos);
                doc.currency = req.body.currency;
                doc.location = {
                    address: req.body.address,
                    coordinates: [
                        parseFloat(req.body.lng), 
                        parseFloat(req.body.lat)
                    ]
                };
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

module.exports.hotelsDeleteOne = function(req, res) {
    hotelID = req.params.hotelID;
    hotel
        .findByIdAndRemove(hotelID)
        .exec(function(err, doc) {
            if(err) {
                res
                    .status(404)
                    .json(err);
            } else {
                console.log("Hotel is deleted, ID: ", hotelID);
                res
                    .status(200)
                    .json();
            }
        });
};