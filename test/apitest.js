var chai = require("chai");
var chaiHttp = require("chai-http");
var mongoose = require("mongoose");

var server = require("../server");
var Workout = require("../app/models/workout");

var should = chai.should();
chai.use(chaiHttp);

describe("FitLog: API Tests", function() {

	Workout.collection.drop();
	
	beforeEach(function(done) {
		var newLog = new Workout({
			workout: "Push Day A",
			notes: ""
		});
		
		newLog.save(function(err) {
			done();
		});
	});
	
	afterEach(function(done) {
		Workout.collection.drop();
		done();
	});
	
	it("should list all logs on /logs GET", function(done) {
		chai.request(server)
			.get("/logs")
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.be.json
				done();
			});
	});
	
	it("should add a single log on /logs POST", function(done) {
		chai.request(server)
			.post("/logs")
			.send({"workout": "Push Day A", "notes": "Shoulders hurt from bench press"})
			.end(function(err, res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a("object");
				res.body.should.have.property("SUCCESS");
				res.body.SUCCESS.should.be.a("object");
				res.body.SUCCESS.should.have.property("workout");
				res.body.SUCCESS.should.have.property("notes");
				res.body.SUCCESS.should.have.property("_id");
				res.body.SUCCESS.workout.should.equal("Push Day A");
				res.body.SUCCESS.notes.should.equal("Shoulders hurt from bench press");
				done();
			});
	});
	
	it("should list a single log on /logs/:id GET");
	it("should update a single log on /logs/:id PUT");
	it("should delete a single log on /logs/:id DELETE");
});