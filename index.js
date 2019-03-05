// using express, postgreSQL, postgres connection pool
var express = require('express');
var app = express();
var Pool = require('pg-pool')
var url = require('url')
// run the services
require('./executionService')

// defining connection pool with database
var pool = new Pool({
  database: 'api',
  user: 'postgres',
  password: 'dave7491',
  port: 5432,
  max: 20, // set pool max size to 20
  min: 4, // set min pool size to 4
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
})

// list of available N=5 services and their current load
var serviceLoad = [0, 0, 0, 0, 0]

// Returns service number for a given storeId
function getServiceNum(storeId, callback) {
  pool.query('SELECT * from stores where storeid=$1', [storeId], (err, result) => {
    if (err) {
      // to interpret error 500
      callback("error500", err.stack);
    }
    if (result.rows[0] == null) {
      // store not found
      console.log('not found')
      callback("error404");
    } else {
      callback(result.rows[0].servicenumber);
    }
  })
}

// Inserts a store into DB if new, if exists then does nothing
function insertIntoDb(storeId, serviceNum, callback) {
  pool.query('INSERT INTO stores (storeid, servicenumber) VALUES ($1,$2) ON CONFLICT (storeid) DO NOTHING', [storeId, serviceNum], (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    callback();
  })
}

// return least loaded service index, increment by 1
function allocateService() {
  var indexLeastLoad = serviceLoad.indexOf(Math.min(...serviceLoad))
  serviceLoad[indexLeastLoad]++
  return indexLeastLoad;
}

// get the storeId from query / path param using regex or get header
function determineStoreValue(query, header, urlPath) {
  if (query == null) {
    var pattern = /(storeId\/)([-\w]*)\//
    var match = urlPath.match(pattern)
    if (match != null) {
      if (match.length < 3) {
        console.log('incorrect input')
      } else {
        return match[2]
      }
    } else {
      console.log('incorrect input')
    }
    // storeId value from query is not undefined
  } else if (query != null) {
    return query
  } else {
    return header
  }
}

// TODO: res codes
// GET response -> get service for sent storeId
app.get('(/*)', function (req, res) {
  var currentStoreId = null;
  var storeFromQuery = url.parse(req.url, true).query.storeId;
  var storeFromHeader = req.header('storeId');
  var urlPath = url.parse(req.url, true).pathname;
  currentStoreId = determineStoreValue(storeFromQuery, storeFromHeader, urlPath)

  getServiceNum(currentStoreId, function (serviceNum) {
    if (serviceNum == "error404") {
      serviceNum = 404;
      res.status(404);
      res.end()
    } else if (serviceNum == 'error500') {
      serviceNum = 500;
    } else {
      // according to the array locating the least loaded service
      // the other local host servers mock different services
      var redirectStr = 'http://localhost:400' + serviceNum + '/?storeId=' + currentStoreId
      res.redirect(307, redirectStr);
    }


    res.end();
  })
});

// TODO: res codes
// POST method to add a shop without calling service
app.post('/*', function (req, res) {
  var currentStoreId = null;
  var urlPath = url.parse(req.url, true).pathname;
  var storeFromQuery = url.parse(req.url, true).query.storeId;
  var storeFromHeader = req.header('storeId');
  var leastLoadedService;

  currentStoreId = determineStoreValue(storeFromQuery, storeFromHeader, urlPath)
  leastLoadedService = allocateService();
  insertIntoDb(currentStoreId, leastLoadedService, function () {
    res.end();
  })
});

app.listen(3000, function () {
  console.log('Server is running.. on Port 3000');
})

module.exports = app, getServiceNum;
