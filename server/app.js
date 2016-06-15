var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded( { extended: false } );
var pg=require('pg');
// user to connect to the "introToSQL" table on local host
// postgres must be running and you must have this db name correct
var connectionString = 'postgres://localhost:5432/introToSQL';

// static public folder
app.use( express.static( 'public' ) );

// base url
app.get( '/', function( req, res ){
  console.log( 'at base url' );
  res.sendFile( path.resolve( 'views/index.html' ) );
}); // end base url

app.post( '/createNew', urlencodedParser, function( req, res ){
  console.log( 'in POST createNew: ' + req.body.username + " " + req.body.active );
  pg.connect( connectionString, function( err, client, done ){
    // "users" is table. username = $1 = req.body.username
    client.query( 'INSERT INTO users ( username, active, created ) VALUES ( $1, $2, $3)', [ req.body.username, req.body.active, 'now()' ] );
  });
}); // end createNew

// spin up server
app.listen( 8080, 'localhost', function( req, res ){
  console.log( "server listening on 8080");
});
