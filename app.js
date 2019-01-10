require("./api/data/db")
var express = require("express");
var path = require("path");
var app = express();
var router = require("./api/routes");
var bodyParser = require("body-parser");


app.use(function(req, res, next) {
    console.log(req.method, req.url)
    next();
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended : false }));

app.use("/api", router);

app.set('port', 3000);

var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log("YEah response is producing on port: " + port);
});


