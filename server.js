var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var LOG_COLLECTION = "logs";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}

	// Save database object from the callback for reuse.
  	db = database;
  	console.log("Database connection ready");

  	// Initialize the app.
  	var server = app.listen(process.env.PORT || 8080, () => {
    		var port = server.address().port;
    		console.log("App now running on port", port);
  	});
});

// LOGS API ROUTES

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
	console.log("Error: ", reason);
	res.status(code || 500).json({"error": message});
}

// /logs
//
// GET  - Find all logs
// POST - Create a new log

app.get("/logs", (req, res) => {
});

app.post("/logs", (req, res) => {
	var newLog = req.body;
	newLog.createDate = new Date();

	if(!(req.body.workout || req.body.notes)) {
		handleError(res, "Invalid user input", "Must provide workout and notes.", 400);
	}
	
	db.collection(LOG_COLLECTION).insertOne(newLog, (err,doc) => {
		if (err) {
			handleError(res, err.message, "Failed to create new log.");
		}
		else {
			res.status(201).json(doc.ops[0]);
		}
	});
});

// /logs/:id
//
// GET - Find a single log by ID
// PUT - Update entire log document
// DELETE - Delete a log by ID

app.get("/logs/:id", (req, res) => {
});

app.put("/logs/:id", (req, res) => {
});

app.delete("/logs/:id", (req, res) => {
});
