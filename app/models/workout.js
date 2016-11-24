var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var WorkoutSchema = new Schema({

	workout: String,
	notes: String,
	exercises: {}
	
});

module.exports = mongoose.model("workout", WorkoutSchema);