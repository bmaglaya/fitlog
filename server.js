var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var LOG_COLLECTION = "logs";

// Connection URL for local dev
var url = "mongodb://localhost:27017/fitlog";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || url, (err, database) => {
		if (err) {
			console.log(err);
			process.exit(1);
		}

		// Save database object from the callback for reuse.
		db = database;
		console.log("Database connection ready");

});

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, () => {
    	var port = server.address().port;
    	console.log("App now running on port", port);
});
	
module.exports = server;

// LOGS API ROUTES

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
		console.log("Error: ", reason);
		res.status(code || 500).json({"error": message});
}

/* 
 * "/logs"
 *
 * GET: Find all logs
 * POST: Create a new log
 *
 */

app.get("/logs", (req, res) => {
		db.collection(LOG_COLLECTION).find({}).toArray((err, docs) => {
				if (err) {
						handleError(res, err.message, "Failed to get logs.");
				}
				else {
						res.status(200).json(docs);
				}
		});
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

/*
 * "/logs/:id"
 *
 * GET: find log by id
 * PUT: update log by id
 * DELETE: deletes log by id
 *
 */

app.get("/logs/:id", (req, res) => {
		db.collection(LOG_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, (err, doc) => {
				if (err) {
						handleError(res, err.message, "Failed to get log.");
				}
				else {
						res.status(200).json(doc);
				}
		});
});

app.put("/logs/:id", (req, res) => {
		var updateDoc = req.body;
		delete updateDoc._id;

		db.collection(LOG_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, (err, doc) => {
				if (err) {
						handleError(res, err.message, "Failed to update log.");
				}
				else {
						res.status(204).end();
				}
		});
});

app.delete("/logs/:id", (req, res) => {
		db.collection(LOG_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, (err, result) => {
				if (err) {
						handleError(res, err.message, "Failed to delete log.");
				}
				else {
						res.status(204).end();
				}
		});
});
















