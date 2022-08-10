#!/usr/bin/env node 
/** 
* Module dependencies.
*/ 
var app = require('../app'); 
var debug = require('debug')('irena:server'); 
var https = require('https'); 
var fs = require('fs'); 
var config = require("../routes/config"); 
/** 
* Get port from environment and store in Express. 
*/ 
console.log(config); 
var port = normalizePort(process.env.PORT ||8030); 
app.set('port', port); 
/** 
* Create HTTPS server. 
 */ 
var options = { 
key: fs.readFileSync('/etc/ssl/keys/www.stacked-services.com.key', 'utf8'), 
cert: fs.readFileSync('/etc/ssl/certs/www.stacked-services.com.chained.crt', 'utf8'), 
passphrase: 'qazwsx@1' 
}; 
var server = https.createServer(options, app); 
/** 
* Listen on provided port, on all network interfaces. 
 */ 
server.listen(port); 
server.on('error', onError); 
server.on('listening', onListening); 
/** 
* Normalize a port into a number, string, or false. 
*/ 
function normalizePort(val) { 
var port = parseInt(val, 10); 
if (isNaN(port)) { 
    // named pipe 
    return val; 
  } 
  if (port >= 0) { 
    // port number 
    return port; 
} 
return false; 
} 
function onError(error) { 
if (error.syscall !== 'listen') { 
throw error; 
} 
var bind = typeof port === 'string' 
? 'Pipe ' + port 
: 'Port ' + port; 
  switch (error.code) { 
    case 'EACCES': 
      console.error(bind + ' requires elevated privileges'); 
      process.exit(1); 
      break; 
    case 'EADDRINUSE': 
    console.error(bind + ' is already in use'); 
    process.exit(1); 
    break; 
    default: 
    throw error; 
 } 
} 
function onListening() { 
var addr = server.address(); 
console.log('addr'+addr.port); 
var bind = typeof addr === 'string' 
? 'pipe ' + addr 
: 'port ' + addr.port; 
debug('Listening on ' + bind); 
} 
