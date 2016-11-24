const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Configs mongodb to dev or test db
var config = require("./config/_config");

// Eliminates mongoose deprecated library warning
mongoose.Promise = global.Promise

// routes//
var routes = require("./app/routes/apiroutes");

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Connection URL to mongodb
var mongo_URI = config.mongoURI[app.settings.env] || process.env.MONGODB_URI;

mongoose.connect(mongo_URI, (err, res) => {
	if (err) {
		console.log("Error connecting to database.", err);
		process.exit(1);
	}
	else {
		console.log("Connected to Database: ", mongo_URI);
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


















