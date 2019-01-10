var mongoose = require("mongoose");

var url = "mongodb://localhost:27017/meanhotel";
mongoose.connect(url);

mongoose.connection.on("connected", function() {
    console.log("Mongoose connected to: " + url);
});

mongoose.connection.on("disconnnected", function() {
    console.log("Mongoose disconnected");
});

mongoose.connection.on("error", function(err) {
    console.log("Mongoose connection error: " + err);
});

process.on("SIGINT", function() {
    mongoose.connection.close(function() {
        console.log("Mongoose disconnected through app termination(SIGINT)");
        process.exit(0);
    });
});

process.on("SIGTERM", function() {
    mongoose.connect.close(function() {
        console.log("Mongoose disconnected through app terminnation(SIGTERM)");
        process.exit(0);
    });
});

require("./hotels.model");