const express = require("express");
var router = express.Router();
var Workout = require("../models/workout");

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

router.get("/logs", function(req, res) {
	Workout.find(function(err, logs) {
		if (err) {
			handleError(res, err.message, "Failed to get logs.");
		}
		else {
			res.status(200).json(logs);
		}	
	});
});

router.post("/logs", function(req, res) {
	var newLog = new Workout({
		workout: req.body.workout,
		notes: req.body.notes
	});

	if(!(req.body.workout || req.body.notes)) {
		handleError(res, "Invalid user input", "Must provide workout and notes.", 400);
	}
	
	newLog.save(function(err) {
		if (err) {
			handleError(res, err.message,"Failed to create new log.");
		}
		else {
			res.status(201).json({"SUCCESS": newLog});
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

router.get("/logs/:id", function(req, res) {
	Workout.findById(req.params.id, function(err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to get requested log.");
		}
		else {
			res.status(200).json(doc);
		}
	});
});

router.put("/logs/:id", function(req, res) {
	Workout.findById({_id: req.params.id}, function(err, log) {
		if (err) {
			handleError(res, err.message, "Failed to update log.");
		}
		
		Object.assign(log, req.body).save(function(err, log) {
			if (err) {
				handleError(res, err.message, "Failed to update log.");
			}
			else {
				res.status(200).json({"UPDATED": log});
			}
		});
	});
});

router.delete("/logs/:id", (req, res) => {
/*
		db.collection(LOG_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, (err, result) => {
				if (err) {
						handleError(res, err.message, "Failed to delete log.");
				}
				else {
						res.status(204).end();
				}
		});
*/
});

module.exports = router;