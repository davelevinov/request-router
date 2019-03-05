// I have not implemented a mock api server because these tests
// essentially do the exact same operations
// using mocha

require('../index.js');
var expect = require('chai').expect;
var request = require('request');

describe('Basic GET POST checks', function () {

    it('should insert a store and get 200', function (done) {
      request.post('http://localhost:3000/?storeId=1000', function (err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should get a store service output with code 200', function (done) {
      request.get('http://localhost:3000/?storeId=1000', function (err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should get 404 for not found store', function (done) {
      var requestLoad = 1;
      while (requestLoad > 0) {
        request.get('http://localhost:3000/?storeId=zzzz', function (err, res) {
          expect(res.statusCode).to.equal(404);
        });
        requestLoad--;
      }
      done();
    })
  });

  describe('server Load test', function () {

    it('should insert X number of stores', function (done) {
      // will use same counter as storeId for simplicity
      var StoresToInsert = 100;
      var pathToSend;
      while (StoresToInsert > 0) {
        pathToSend = 'http://localhost:3000/?storeId=' + StoresToInsert 
        request.post(pathToSend, function (err, res) {
          expect(res.statusCode).to.equal(200);
        });
        StoresToInsert--;
      }
      done();
    });

    it('should make X number of GET requests', function (done) {
      // will use same counter as storeId for simplicity
      var StoresToGet = 100;
      var pathToSend;
      while (StoresToGet > 0) {
        pathToSend = 'http://localhost:3000/?storeId=' + StoresToGet 
        request.get(pathToSend, function (err, res) {
          expect(res.statusCode).to.equal(200);
        });
        StoresToGet--;
      }
      done();
    });
  });