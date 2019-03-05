// each instance emulates a service
var express = require('express');
var url = require('url')
var app = express();
var app1 = express();
var app2 = express();
var app3 = express();
var app4 = express();

app.get('(/*)', function (req, res) {
    console.log('store %s recieved at service 0', url.parse(req.url, true).query.storeId)
    res.sendStatus(200)
    res.end();
});

app1.get('(/*)', function (req, res) {
    console.log('store %s recieved at service 1', url.parse(req.url, true).query.storeId)
    res.sendStatus(200)
    res.end();
});

app2.get('(/*)', function (req, res) {
    console.log('store %s recieved at service 2', url.parse(req.url, true).query.storeId)
    res.sendStatus(200)
    res.end();
});

app3.get('(/*)', function (req, res) {
    console.log('store %s recieved at service 3', url.parse(req.url, true).query.storeId)
    res.sendStatus(200)
    res.end();
});

app4.get('(/*)', function (req, res) {
    console.log('store %s recieved at service 4', url.parse(req.url, true).query.storeId)
    res.sendStatus(200)
    res.end();
});

app.listen(4000, function () {
    console.log('Service 0 is running');
})

app1.listen(4001, function () {
    console.log('Service 1 is running');
})

app2.listen(4002, function () {
    console.log('Service 2 is running');
})

app3.listen(4003, function () {
    console.log('Service 3 is running');
})

app4.listen(4004, function () {
    console.log('Service 4 is running');
})

module.exports = app, app1, app2, app3, app4;