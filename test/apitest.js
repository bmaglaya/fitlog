process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var mongoose = require("mongoose");

var server = require("../server");
var Workout = require("../app/models/workout");

var should = chai.should();
chai.use(chaiHttp);

describe("FitLog: API Tests", function() {
	
	beforeEach(function(done) {
		var newLog = new Workout({
			workout: "Push Day A",
			notes: "shoulder hurts"
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
				res.body.should.be.a("array");
				res.body[0].should.have.property("_id");
				res.body[0].should.have.property("workout");
				res.body[0].should.have.property("notes");
				res.body[0].workout.should.equal("Push Day A");
				res.body[0].notes.should.equal("shoulder hurts");
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
	
	it("should list a single log on /logs/:id GET", function(done) {
		var newLog = new Workout({
			workout: "Legs",
			notes: "squats"
		});
		
		newLog.save(function(err, data) {
			chai.request(server)
				.get("/logs/" + data.id)
				.end(function(err, res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a("object");
					res.body.should.have.property("_id");
					res.body.should.have.property("workout");
					res.body.should.have.property("notes");
					res.body.workout.should.equal("Legs");
					res.body.notes.should.equal("squats");
					res.body._id.should.equal(data.id);
					done();
				});
		});
	});
	
	it("should update a single log on /logs/:id PUT", function(done) {
		chai.request(server)
			.get("/logs")
			.end(function(err, res) {
				chai.request(server)
					.put("/logs/" + res.body[0]._id)
					.send({"workout": "Lower Body"})
					.end(function(error, response) {
						response.should.have.status(200);
						response.should.be.json;
						response.body.should.be.a("object");
						response.body.should.have.property("UPDATED");
						response.body.UPDATED.should.be.a("object");
						response.body.UPDATED.should.have.property("workout");
						response.body.UPDATED.should.have.property("_id");
						response.body.UPDATED.workout.should.equal("Lower Body");
						done();
					});
			});
	});
	
	
	it("should delete a single log on /logs/:id DELETE", function(done) {
		chai.request(server)
			.get("/logs")
			.end(function(err, res) {
				chai.request(server)
				.delete("/logs/" + res.body[0]._id)
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;
					response.body.should.be.a("object");
					response.body.should.have.property("REMOVED");
					response.body.REMOVED.should.be.a("object");
					response.body.REMOVED.should.have.property("workout");
					response.body.REMOVED.should.have.property("_id");
					done();
				});
			});
	});
});











