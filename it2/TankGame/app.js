// start med å definere en del variable
let app      = require('express')();
let server   = require('http').Server(app);
let io       = require('socket.io')(server);
let gameport = process.env.PORT || 4004;
let antallSpillere = 0;

let world = {};   // empty world

server.listen( gameport );

console.log('Spillet kjøres fra http://localhost:' + gameport, __dirname );

// dersom du ikke spesifiserer en fil, da sender vi game.html
app.get( '/', function( req, res ){ 
     console.log(__dirname);
     res.sendFile( __dirname + '/game.html' );
});


// alle andre filer
app.get( '/*' , function( req, res, next ) {
   // filnavnet de har bestillt
   var file = req.params[0]; 
   // send filen
   console.log(__dirname, file);
   res.sendFile( __dirname + '/' + file );
});

// samtaler med klientene
io.on('connection', function(socket) {  

   io.emit('stats', { antallSpillere });
   
   socket.on('disconnect', function() {
     antallSpillere = (Object.keys(world)).length;
     io.emit('stats', { antallSpillere });
   });

   // en spiller er klar, tell alle og send stats
   socket.on('ready', function(player) {
     world[player.navn] = player;
     antallSpillere = (Object.keys(world)).length;
     io.emit('stats', { antallSpillere });
   });

   // en spiller skyter
   // bare broadcast til alle andre
   socket.on("fire", function(data) {
     io.emit("fire",data);
   });

   // noen har truffet noe
   // bare broadcast til alle andre
   socket.on("hit", function(actor, target) {
     console.log("hit",actor,target);
     io.emit("hit",actor, target);
   });

   
   // en spiller har flytta på tanksen sin
   socket.on('newpos', function(data) {
     let {myself, posVelRot} = data;
     let body = world[myself].body || {};
     body.x = posVelRot.x;
     body.y = posVelRot.y;
     body.v = posVelRot.v;
     body.r = posVelRot.r;
     world[myself].body = body;
     io.emit('update', world);
   });
   
   // en spiller ønsker å starte, alle tilkobla får startbeskjed
   socket.on('start', function(data) {
     let player = data;
     if (player.navn) {
       world[player.navn] = player;
     }
     io.emit('startgame', world);
   });
});