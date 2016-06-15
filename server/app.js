var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded( { extended: false } );
var pg=require('pg');
// user to connect to the "introToSQL" table on local host
// postgres must be running and you must have this db name correct
var connectionString = 'postgres://localhost:5432/db_lecture_6_14';

var 

// static public folder
app.use( express.static( 'public' ) );

// base url
app.get( '/', function( req, res ){
  console.log( 'at base url' );
  res.sendFile( path.resolve( 'views/index.html' ) );
}); // end base url

// creates a new user from the req.body object that is received
app.post( '/createNew', urlencodedParser, function( req, res ){
  console.log( 'in POST createNew: ' + req.body.username + " " + req.body.active );
  pg.connect( connectionString, function( err, client, done ){
    // "users" is table. username = $1 = req.body.username
    client.query( 'INSERT INTO users ( username, active, created ) VALUES ( $1, $2, $3 )', [ req.body.username, req.body.active, 'now()' ] );
  });
}); // end createNew

// send back all records in users that conform to the query
app.get( '/getUsers', function( req, res ){
  console.log( 'in get users' );
// this wil hold our results
  var results =[];
  pg.connect( connectionString, function( err, client, done ){
    // get all user records and store in "query" variable
    var query = client.query( 'SELECT * FROM users WHERE active=true ORDER BY id DESC;' );
    console.log( "query: " + query );
    // push each row in query into our results array
    var rows = 0;
    query.on( 'row', function ( row ){
      results.push( row );
    }); // end query push
    query.on( 'end', function (){
      return res.json( results );
    });
  }); // end connect
});

app.post('/deactivateUser', urlencodedParser, function(req, res) {
  var results =[];

  pg.connect(connectionString, function(err, client, done) {
    client.query('UPDATE users SET active = false WHERE id = ' + req.body.id + ';');
    var query = client.query( 'SELECT * FROM users WHERE active=true ORDER BY id DESC;' );
    console.log( "query: " + query );
    // push each row in query into our results array
    var rows = 0;
    query.on( 'row', function ( row ){
      results.push( row );
    }); // end query push
    query.on( 'end', function (){
      return res.json( results );
    });
  });
});
app.post('/deleteUser', urlencodedParser, function(req, res) {
  var results =[];

  pg.connect(connectionString, function(err, client, done) {
  client.query('DELETE FROM users WHERE id = ' + req.body.id + ';');
  var query = client.query( 'SELECT * FROM users WHERE active=true ORDER BY id DESC;' );
  console.log( "query: " + query );
  // push each row in query into our results array
  var rows = 0;
  query.on( 'row', function ( row ){
    results.push( row );
  }); // end query push
  query.on( 'end', function (){
    return res.json( results );
  });

});

});
// spin up server
app.listen( 8080, 'localhost', function( req, res ){
  console.log( "server listening on 8080");
});
