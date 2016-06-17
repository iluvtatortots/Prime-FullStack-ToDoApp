var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var pg = require('pg');
var connectionString='postgres://localhost:5432/testDB';

// spin up server
app.listen(8080, 'localhost', function(req, res){
  console.log('8080 is listening');
});

// static route for public folder
app.use(express.static('public'));

// base url, resolve path to index.html
app.get('/', function(req, res){
  console.log('in base url');
  res.sendFile(path.resolve('views/index.html'));
});

// post route (requires urlencodedParser injection)
app.post('/postRoute', urlencodedParser, function(req, res){
  console.log('in postRoute, trying to post to db: ' + req.body.username);
});
