var mongoose = require("mongoose");
var hotel = mongoose.model("Hotel");

module.exports.hotelsGetAll = function(req, res) {

var offset = 0;
var count = 5;

if(req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
}

if(req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
}

hotel
    .find()
    .skip(offset)
    .limit(count)
    .exec(function(err, hotels) {
        console.log("Found Hotels: ", hotels.length);
        res
            .status(200) 
            .json(hotels);
    });
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
};

module.exports.hotelsGetOne = function(req, res) {
    // var db_connection = dbconn.get();
    // var db = db_connection.db('meanhotel');
    // var collection = db.collection('hotels');

    var hotelID = req.params.hotelID;

    hotel
        .findById(hotelID)
        .exec(function(err, doc) {
            res    
                .status(200)
                .json(doc);
        });
};

module.exports.hotelsAddOne = function(req, res) {
    var db_connection = dbconn.get();
    var db = db_connection.db('meanhotel');
    var collection = db.collection('hotels');
    var newHotel;
    if(req.body && req.body.name && req.body.stars) {
        newHotel = req.body;
        newHotel.stars = parseInt(newHotel.stars);
        collection.insertOne(newHotel, function(err, response) {
            console.log(response);
            console.log(response.ops);
            res 
            .status(201)
            .json(response.ops);

        });
    } else {
        console.log("Data is missing from the request");
        res 
            .status(400)
            .json({"message": "Required data missing from the body"});
    }
};