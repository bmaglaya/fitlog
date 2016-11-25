const express = require("express");
var router = express.Router();
var Workout = require("../models/workout");

/*
 *	API Routes
 */
router.get("/logs", findAllLogs);
router.post("/logs", addNewLog);

router.get("/logs/:id", findLog);
router.put("/logs/:id", updateLog);
router.delete("/logs/:id", deleteLog);

/*
 *	Generic error handler used by all endpoints.
 */
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

function findAllLogs(req, res) {
	Workout.find(function(err, logs) {
		if (err) {
			handleError(res, err.message, "Failed to get logs.");
		}
		else {
			res.json(logs);
		}	
	});
}

function addNewLog(req, res) {
	var newLog = new Workout(req.body);
	
	newLog.save(function(err) {
		if (err) {
			handleError(res, err.message,"Failed to create new log.");
		}
		else {
			res.json({"SUCCESS": newLog});
		}
	});	
}

/*
 * "/logs/:id"
 *
 * GET: find log by id
 * PUT: update log by id
 * DELETE: deletes log by id
 *
 */

function findLog(req, res) {
	Workout.findById(req.params.id, function(err, log) {
		if (err) {
			handleError(res, err.message, "Failed to get requested log.");
		}
		else {
			res.json(log);
		}
	});
}

function updateLog(req, res) {
	Workout.findById({_id: req.params.id}, function(err, log) {
		if (err) {
			handleError(res, err.message, "Failed to find log.");
		}
		
		Object.assign(log, req.body).save(function(err, log) {
			if (err) {
				handleError(res, err.message, "Failed to update log.");
			}
			else {
				res.json({"UPDATED": log});
			}
		});
	});
}

function deleteLog(req, res) {
	Workout.findById(req.params.id, function(err, log) {
		if (err) {
			handleError(res, err.message, "Cannot find requested log.");
		}
		else {
			log.remove(function(err) {
				if (err) {
					handleError(res, err.message, "Failed to delete log.");
				}
				else {
					res.json({"REMOVED": log});
				}
			});
		}
	});
}

module.exports = router;