var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var should = chai.should();

chai.use(chaiHttp);

describe("FitLog: API Tests", function() {

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
				
				done();
			});
	});
	
	it("should list all a single log on /logs/:id GET");
	it("should update a single log on /logs/:id PUT");
	it("should delete a single log on /logs/:id DELETE");
});