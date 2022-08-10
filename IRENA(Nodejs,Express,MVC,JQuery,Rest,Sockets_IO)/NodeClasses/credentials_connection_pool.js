/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mysql = require('promise-mysql');
var wait = require('wait.for-es6');
var credentials_pool = mysql.createPool(
    {
	connectionLimit: 1000,
	host: "localhost",
	user: "acelerex",
	password: "@acelerex!123",
	database: "credentials",
	acquireTimeout: 1000000
    }
);

var getSqlCredentialsConnection = function() {
    
  
 return credentials_pool.getConnection().disposer(function(connection) {
    credentials_pool.releaseConnection(connection);
  });        /*
            .then(function (rows) {
                    console.log(" >> query performed");
                    dbCall = true;
                    console.log(rows.length);
                    dbRow = rows;
                    return 1;
                }).catch(function (error) {
                    console.log(error);
                    dbCall = true;
                    return 0;

                });
                */
  
};




module.exports = getSqlCredentialsConnection;

