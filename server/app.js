var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var pg = require('pg');
var connectionString='postgres://localhost:5432/toDoApp';

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

// send new task to DB
app.post('/createTask', urlencodedParser, function(req, res){
  console.log('in createTask, task: ' + req.body.task);
  pg.connect(connectionString, function(err, client, done){
    var sendTask = client.query('INSERT INTO todolist (task, status) VALUES ($1, $2)', [req.body.task, req.body.status]);
    sendTask.on('end', function(){
      return res.end();
    }); // end post end
    done();
  }); // end pg connect
}); // end createTask post

// complete task
app.post('/completeTask', urlencodedParser, function(req, res){
  console.log('in completeTask: ' + req.body.id);
  pg.connect(connectionString, function(err, client, done){
    client.query('UPDATE todolist SET status=true WHERE id=($1)', [req.body.id]);
    done();
  }); // end pg connect
}); // end delete task

// delete task
app.post('/deleteTask', urlencodedParser, function(req, res){
  console.log('in deleteTask: ' + req.body.id);
  pg.connect(connectionString, function(err, client, done){
    client.query('DELETE from todolist WHERE id=($1)', [req.body.id]);
    done();
  }); // end pg connect
}); // end delete task

// request retrieval of all tasks from DB
app.get('/getTasks', function(req, res){
  var tasksFromDB = [];
  pg.connect(connectionString, function(err, client, done){
    var requestDB = client.query('SELECT * FROM todolist ORDER BY status ASC');
    requestDB.on('row', function(row){
      tasksFromDB.push(row);
    }); // end query push
    requestDB.on('end', function(){
      return res.json(tasksFromDB);
    }); // end on end
    if(err){
      console.log(err);
    } // end err
    done();
  }); // end pg connect
}); // end getTasks get
