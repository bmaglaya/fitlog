var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var LOG_COLLECTION = "logs";

// Connection URL for local dev
var url = "mongodb://localhost:27017/fitlog";

// routes//
var routes = require("./app/routes/apiroutes");

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

mongoose.connect(process.env.MONGODB_URI || url, (err, res) => {
	if (err) {
		console.log("Error connecting to database.", err);
		process.exit(1);
	}
	else {
		console.log("Database connection ready.");
	}
});

// main routes//
app.use("/", routes);

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, () => {
    var port = server.address().port;
    console.log("App now running on port", port);
});
	
module.exports = server;


















