/*
 * Copyright 2018 Acelerex Inc.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var APIconfig = require('./config');
var archiver = require('archiver');
const path = require('path');
var utils = require('./utils');
var saveInputs = require('./save.js');
var request = require("request");
var open = require('open');
var portfinder = require('portfinder');
var extIP = require("ext-ip")();
var waitUntil = require('wait-until');
var sys = require('util');
var exec = require('child_process').exec;
var fs = require('fs');
var readline = require('readline');
var archiver = require('archiver');
var http = require('http');
const mime = require('mime');
var eventEmitter = require('events').EventEmitter;
//classes
var TcpClass = require('../NodeClasses/HttpsRequestsClass');
var UserSessions = require("../NodeClasses/UserSession");
var url;
extIP.get().then(ip => {
    url = "https://" + ip;
}, err => {
    console.error(err);
    return;

});

// var SBTOptions = {
//     hostname: APIconfig.api['hostname'],
//     port: APIconfig.api['port'],
//     path: '/api/v1',
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     ca: fs.readFileSync('/etc/ssl/certs/www.stacked-services.com.chained.crt', 'utf8'),
//     rejectUnauthorized: false
// };

/*
 * obj that holds all the sessions active from the web interface
 * @type UserSessions
 */
//var userSessions = new UserSessions(eventEmitter);
/*
 * Object that holds the FtpClass
 * @type FtpClass
 */
//var TcpCall = new TcpClass(SBTOptions);

/* GET home page. */
router.get(
        '/',
        function (req, res, next) {
            console.log("start test");
            if (req.app.settings.port === 3000)
            {
                console.log(" >> starting request from port 3000");
                //userSessions.ReadFromSessions1(res);
                res.render(
                        'log-in/log-in',
                        {

                        });
                res.end();


            } else if (req.app.settings.port === 4000)
            {
                userSessions.ReadFromSessions(res);
                console.log("test");
                res.render(
                        'log-in-test-script',
                        {

                        });
            } else
            {
                res.render(
                        'errors_page/500_operation_not_allowed',
                        {

                        });
                // displays Operation not permitted pug page
            }

        });

router.get('/REQ_GET_COMETS_CREDENTIALS', function (req, res) {

    var tcpClass = new TcpClass(SBTOptions);
    var ip;

    //Check if the ip sent by Nginx is localhost or real-ip of the user
    //If the ip is localhost, use real-ip instead
    if (req.ip === "::ffff:127.0.0.1")
        ip = "::ffff:" + req.headers['x-real-ip'] || req.info.remoteAddress;
    else
        ip = req.ip;
    console.log(' >> REQ_GET_COMETS_CREDENTIALS ' + ip);
    var _request = {request: "8001:REQ_CREDENTIAL_VALIDATION"};
    _request.username = req.body.username;
    _request.password = req.body.password;
    _request.reqIp = ip;
    tcpClass.makeHttpsRequest(_request);
    console.log(" - TCP CALL REQUESTED >> " + ip);

    waitUntil()
            .interval(1000)
            .times(100)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {
                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                if (tcpClass.getHttpsResponse() === "")
                {
                    res.send("SERVER SENT EMPTY RESPONSE");
                    res.end();
                    return;
                }

                var obj = JSON.parse(JSON.stringify(tcpClass.getHttpsResponse()));
                console.log(" >> RESPONSE VALIDATED");

                obj = JSON.parse(obj);

                if (obj.response === "7000:CREDENTIAL_ACCEPTED")
                {

                    console.log("- Accepted >> " + obj.username);
                    userSessions.findUserName(obj.username);
                    waitUntil()
                            .interval(100)
                            .times(10)
                            .condition(function () {
                                return (userSessions.getStatus() ? true : false);
                            })
                            .done(function (result) {
                                if (userSessions.getDbRows().length > 0)
                                    ReactivateBackEndSession(res, obj);
                                else
                                    SetBackEndInstance(ip, res, obj);
                            });

                } else
                {
                    res.send(obj);
                    res.end();
                }
                delete tcpClass;
            });




});


//Process request to remove the current session from the database and logout user
router.post('/REQ_LOGOUT', function (req, res) {
    console.log(" >> REQ_LOGOUT " + req.ip);
    var tcpClass = new TcpClass(SBTOptions);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);


    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    var makeRequest = {
        request: "8003:REQ_SESSION_CLOSE",
        reqIp: req.ip,
        username: req.body.username,
        token: session.token
    };
    tcpClass.makeHttpsRequest(makeRequest);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {
                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                if (tcpClass.getHttpsResponse() === "")
                {
                    res.send("ERROR : SERVER SENT EMPTY RESPONSE");
                    res.end();
                    delete tcpClass;
                } else
                {

                    var obj = JSON.parse(tcpClass.getHttpsResponse());


                    obj.url = url;
                    console.log(">>Logout url" + obj.url);
                    res.send(obj);
                    res.end();
                    userSessions.DeleteSessionFromSessions(session);
                    delete tcpClass;




                }
            });

});

var firstRequest = false;
var requestEnd = false;
var count = 0;
var test = function (req, res)
{
    count++;
    console.log(" inside ");
    requestEnd = false;
    firstRequest = true;

    var ip;
    if (req.ip === "::ffff:127.0.0.1")
        ip = "::ffff:" + req.headers['x-real-ip'] || req.info.remoteAddress;
    else
        ip = req.ip;

    var tcpClass = new TcpClass(SBTOptions);
    console.log(' >> REQ_GET_COMETS_CREDENTIALS ' + ip);
    var _request = {request: "8001:REQ_CREDENTIAL_VALIDATION"};
    _request.username = req.body.username;
    _request.password = req.body.password;
    _request.reqIp = ip;

    var client = tcpClass.makeHttpsRequest1(tcpClass, _request, res, ReactivateBackEndSession, SetBackEndInstance, ip);


    console.log(" - TCP CALL REQUESTED >> " + ip);
    console.log(" - TCP CALL REQUESTED IS CLOSED >> " + tcpClass.isClosed());

    if (tcpClass.hasError())
    {
        console.log(">> Has Errors");
        res.send(tcpClass.getHttpsResponse());
        res.end();
        return;
    }
    if (tcpClass.getHttpsResponse() === "")
    {
        console.log(">> SERVER SENT EMPTY RESPONSE");

        return;
    }
    console.log(" >>> requesting Finished");




};
var requestCount = 0;
var test1 = function (req, res)
{
    console.log(" >>>> request" + requestCount);
    requestCount++;
    test(req, res);

};
router.post('/REQ_GET_COMETS_CREDENTIALS', test1);

//Downloading Reserve and energy prices
router.get('/REQ_ZIP_CSV_FILES', function (req, res) {
    console.log("Creating empty zip");

    var id = req.query.scenarios_and_cases_row_id;
    var output = fs.createWriteStream('/home/gonzales1609/IRENA/SBT_Api/OutputCharts_PC_' + id + '.zip');
    var archive = archiver('zip', {
        gzip: true,
        zlib: {level: 9}
    });

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log("Archiver has been finalized and output file descriptor has closed.");

    });
    archive.on('error', function (err) {
        throw err;
    });

    console.log("Pipe Output zip")
    archive.pipe(output);

    console.log("Adding files to zip");
    //Needs to be updated to add all files// Archiver Module npm
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_generation_1_' + id + '.csv',
            {name: 'Generation-Profile.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_primres_1_' + id + '.csv',
            {name: 'Primary-Reserve-Profile.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_secres_1_' + id + '.csv',
            {name: 'Secondary-Reserve-Profile.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_tertres_1_' + id + '.csv',
            {name: 'Tertiary-Reserve-Profile.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_enerprice_1_' + id + '.csv',
            {name: 'Energy-Prices.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_resprice_1_' + id + '.csv',
            {name: 'Reserve-Prices.csv'});
    archive.finalize();
    res.end();

    //fs.unlink('/home/gonzales1609/IRENA/SBT_Api/OutputCharts.zip');
});

//Downloading Reserve and energy prices
router.get('/REQ_ZIP_CSV_FILES_NOESS', function (req, res) {
    console.log("Creating empty zip");

    var id = req.query.scenarios_and_cases_row_id;
    var output = fs.createWriteStream('/home/gonzales1609/IRENA/SBT_Api/OutputCharts_PC_' + id + '_noess.zip');
    var archive = archiver('zip', {
        gzip: true,
        zlib: {level: 9}
    });

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log("Archiver has been finalized and output file descriptor has closed.");

    });
    archive.on('error', function (err) {
        throw err;
    });

    console.log("Pipe Output zip")
    archive.pipe(output);

    console.log("Adding files to zip");
    //Needs to be updated to add all files// Archiver Module npm
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_generation_noess_1_' + id + '.csv',
            {name: 'Generation-Profile-NoESS.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_primres_noess_1_' + id + '.csv',
            {name: 'Primary-Reserve-Profile-NoESS.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_secres_noess_1_' + id + '.csv',
            {name: 'Secondary-Reserve-Profile-NoESS.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_tertres_noess_1_' + id + '.csv',
            {name: 'Tertiary-Reserve-Profile-NoESS.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_enerprice_noess_1_' + id + '.csv',
            {name: 'Energy-Prices-NoESS.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/PC_resprice_noess_1_' + id + '.csv',
            {name: 'Reserve-Prices-NoESS.csv'});
    archive.finalize();
    res.end();

    //fs.unlink('/home/gonzales1609/IRENA/SBT_Api/OutputCharts.zip');
});


//Process request to zip emulator csv files
router.get('/REQ_EM_ZIP_CSV_FILES_NOESS', function (req, res) {
    console.log("Creating empty zip for EM NoESS");

    var id = req.query.scenarios_and_cases_row_id;
    var output = fs.createWriteStream('/home/gonzales1609/IRENA/SBT_Api/OutputCharts_EM_' + id + '_noess.zip');
    var archive = archiver('zip', {
        gzip: true,
        zlib: {level: 9}
    });

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log("Archiver has been finalized and output file descriptor has closed.");

    });
    archive.on('error', function (err) {
        throw err;
    });

    console.log("Pipe Output zip")
    archive.pipe(output);

    console.log("Adding files to zip");
    //Needs to be updated to add all files// Archiver Module npm
    archive.file('/home/gonzales1609/IRENA/SBT_Api/EM_generation_noess_1_' + id + '.csv',
            {name: 'Emulator-Generation-NoESS.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/EM_primres_noess_1_' + id + '.csv',
            {name: 'Emulator-Primary-Dispatch-NoESS.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/EM_secres_noess_1_' + id + '.csv',
            {name: 'Emulator-Secondary-Dispatch-NoESS.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/EM_tertres_noess_1_' + id + '.csv',
            {name: 'Emulator-Tertiary-Dispatch-NoESS.csv'});
    archive.finalize();
    res.end();
});
//Process request to zip emulator csv files
router.get('/REQ_EM_ZIP_CSV_FILES', function (req, res) {
    console.log("Creating empty zip");

    var id = req.query.scenarios_and_cases_row_id;
    var output = fs.createWriteStream('/home/gonzales1609/IRENA/SBT_Api/OutputCharts_EM_' + id + '.zip');
    var archive = archiver('zip', {
        gzip: true,
        zlib: {level: 9}
    });

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log("Archiver has been finalized and output file descriptor has closed.");

    });
    archive.on('error', function (err) {
        throw err;
    });

    console.log("Pipe Output zip")
    archive.pipe(output);

    console.log("Adding files to zip");
    //Needs to be updated to add all files// Archiver Module npm
    archive.file('/home/gonzales1609/IRENA/SBT_Api/EM_generation_1_' + id + '.csv',
            {name: 'Emulator-Generation.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/EM_primres_1_' + id + '.csv',
            {name: 'Emulator-Primary-Dispatch.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/EM_secres_1_' + id + '.csv',
            {name: 'Emulator-Secondary-Dispatch.csv'});
    archive.file('/home/gonzales1609/IRENA/SBT_Api/EM_tertres_1_' + id + '.csv',
            {name: 'Emulator-Tertiary-Dispatch.csv'});
    archive.finalize();
    res.end();
});

//Process request to download the production cost zip file
router.get('/REQ_PROD_NOESS_DOWNLOAD', function (req, res) {

    var id = req.query.scenarios_and_cases_row_id;
    var filePath = '/home/gonzales1609/IRENA/SBT_Api/OutputCharts_PC_' + id + '_noess.zip';

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.redirect('back');
    }

});

router.get('/REQ_PROD_DOWNLOAD', function (req, res) {

    var id = req.query.scenarios_and_cases_row_id;
    var filePath = '/home/gonzales1609/IRENA/SBT_Api/OutputCharts_PC_' + id + '.zip';

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.redirect('back');
    }

});


//Process request to download the Emulator zip file
router.get('/REQ_EM_NOESS_DOWNLOAD', function (req, res) {

    var id = req.query.scenarios_and_cases_row_id;
    var filePath = '/home/gonzales1609/IRENA/SBT_Api/OutputCharts_EM_' + id + '_noess.zip';

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.redirect('back');
    }

});

//Process request to download the Emulator zip file
router.get('/REQ_EM_DOWNLOAD', function (req, res) {

    var id = req.query.scenarios_and_cases_row_id;
    var filePath = '/home/gonzales1609/IRENA/SBT_Api/OutputCharts_EM_' + id + '.zip';

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.redirect('back');
    }

});

router.get('/REQ_CHECK_ZIP_EXISTS', function (req, res)
{
    var id = req.query.scenarios_and_cases_row_id;
    var resp = {};
    var filePathPC = '/home/gonzales1609/IRENA/SBT_Api/OutputCharts_PC_' + id + '.zip';
    var filePathEM = '/home/gonzales1609/IRENA/SBT_Api/OutputCharts_EM_' + id + '.zip';
    var filePathPCNoess = '/home/gonzales1609/IRENA/SBT_Api/OutputCharts_PC_' + id + '_noess.zip';
    var filePathEMNoess = '/home/gonzales1609/IRENA/SBT_Api/OutputCharts_EM_' + id + '_noess.zip';

    resp.PC_ZIP = fs.existsSync(filePathPC);
    resp.EM_ZIP = fs.existsSync(filePathEM);
    resp.PC_NOESS_ZIP = fs.existsSync(filePathPCNoess);
    resp.EM_NOESS_ZIP = fs.existsSync(filePathEMNoess);

    res.send(resp);

});


/*
 * Validating the user
 * it creates a session if authenticaction is successfull
 */
router.post('/REQ_CREDENTIAL_VALIDATION', function (req, res) {

    // var tcpClass = new TcpClass(SBTOptions);
    // var ip;
    // if (req.ip === "::ffff:127.0.0.1")
    //     ip = "::ffff:" + req.headers['x-real-ip'] || req.info.remoteAddress;
    // else
    //     ip = req.ip;
    console.log("- REQ_CREDENTIAL_VALIDATION >> REQUESTING FTP CALL " + req.ip);
    console.log("This is the request body " + JSON.stringify(req.body));
    var _request = {request: "8001:REQ_CREDENTIAL_VALIDATION"};
    _request.username = req.body.username;
    _request.password = req.body.password;
    _request.reqIp = ip;
    tcpClass.makeHttpsRequest(_request);
    console.log(" - TCP CALL REQUESTED >> " + ip);
     
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {
                    console.log(" >> REQUEST HAS ERRORS");
                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                if (tcpClass.getHttpsResponse() === "")
                    res.send("Error");
                else
                {
                    var obj = JSON.parse(tcpClass.getHttpsResponse());
                    if (obj.response === "7000:CREDENTIAL_ACCEPTED")
                    {
                        console.log("- Accepted >> " + obj.username);
                        console.log(" >> obj.status " + obj.status);
                        if (obj.active)
                        {
                            console.log(" >> reactivate session");
                            ReactivateSession(res, obj);
                        } else
                        {
                            SetUpInstance(ip, res, obj);
                        }

                    } else
                    {
                        res.send(obj);
                        res.end();
                    }
                }
                delete tcpClass;
            });

    console.log(" - End");
});

//Process request to delete scenario and case
router.post('/REQ_DELETE', function (req, res)
{
    console.log("REQ_DELETE " + req.ip);
    var tcpClass = new TcpClass(SBTOptions);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);

    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    var makeRequest = {};
    if (typeof req.body.case === 'undefined' || req.body.case === "")
    {
        var makeRequest = {
            request: "8005:REQ_DELETE_PROJECT",
            reqIp: req.ip,
            username: req.body.username,
            token: session.token,
            scenario: req.body.scenario
        };


    } else
    {
        var makeRequest = {
            request: "8006:REQ_DELETE_RUNS",
            reqIp: req.ip,
            username: req.body.username,
            token: session.token,
            scenario: req.body.scenario,
            case: req.body.case
        };

    }
    tcpClass.makeHttpsRequest(makeRequest);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                res.send(tcpClass.getHttpsResponse());
                res.end();
                delete tcpClass;
            });



});
/*
 * It assignes the port after after client has been authenticated
 * if the client ip is not recognized it sends back to log-in page
 * c
 */

router.get('/REQ_SYSTEM_BENEFFITS_TOOL', function (req, res)
{
    //userSessions.ReadFromSessions();
    //var tcpClass = new TcpClass(SBTOptions);
    console.log("REQ_SYSTEM_BENEFFITS_TOOL " + req.ip);
    res.render('index', {username: 'test'});
    // waitUntil()
    //         .interval(1000)
    //         .times(1000)
    //         .condition(function () {
    //             return  true;//(userSessions.getStatus() ? true : false);
    //         })
    //         .done(function (result) {
    //             //var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);

    //             var resp = {};
    //             resp.response = "INVALID_OPERATION";
    //             resp.url = url;
    //             if (index === -1)
    //             {
    //                 res.send(resp);
    //                 console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
    //                 return;
    //             }
    //             var session = userSessions.getSessionByIndex(index);
    //             if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    //             {
    //                 console.log(" >> VALIDATE SESSION BY IP IS NULL");
    //                 res.send(resp);
    //                 res.end();
    //                 return;
    //             }
    //             console.log("- REQ_SYSTEM_BENEFFITS_TOOL >> STARTING SESSION FOR " + req.ip);
    //             res.render('index', {username: session.username});
    //             var makeRequest = {
    //                 request: "8008:REQ_SET_SESSION_PORT",
    //                 reqIp: req.ip,
    //                 username: session.username,
    //                 token: session.token
    //             };
    //             console.log(session.token);
    //             console.log(">> REQ_SET_SESSION_PORT " + req.ip);
    //             TcpCall.makeHttpsRequest(makeRequest);
    //             console.log(" - TCP CALL REQUESTED >> " + req.ip);
    //             waitUntil()
    //                     .interval(1000)
    //                     .times(10)
    //                     .condition(function () {
    //                         return (tcpClass.isClosed() ? true : false);
    //                     })
    //                     .done(function (result) {
    //                         delete tcpClass;
    //                     });


    //         });


});

//Process Alternative analysis calculation request
router.post('/REQ_ALTERNATIVE_ANALYSIS_CALCULATION', function (req, res)
{
    var tcpClass = new TcpClass(SBTOptions);
    console.log("REQ_ALTERNATIVE_ANALYSIS_CALCULATION " + req.ip);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);

    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    var makeRequest = {
        request: "8004:REQ_ALTERNATIVE_ANALYSIS_CALCULATION",
        reqIp: req.ip,
        username: req.body.username,
        token: session.token,
        scenario: req.body.scenario,
        case: req.body.case
    };
    tcpClass.makeHttpsRequest(makeRequest);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                res.send(tcpClass.getHttpsResponse());
                res.end();
                delete tcpClass;
            });


});

//Process request to get data from alternative analysis calculatio
router.post('/REQ_ALTERNATIVE_ANALYSIS_DATA', function (req, res)
{
    var tcpClass = new TcpClass(SBTOptions);
    console.log("REQ_ALTERNATIVE_ANALYSIS_DATA " + req.ip);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);

    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    var makeRequest = {
        request: "8010:REQ_ALTERNATIVE_ANALYSIS_DATA",
        reqIp: req.ip,
        username: req.body.username,
        token: session.token,
        scenario: req.body.scenario,
        case: req.body.case
    };
    tcpClass.makeHttpsRequest(makeRequest);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);

    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                res.send(tcpClass.getHttpsResponse());
                res.end();
                delete tcpClass;
            });

});

//Process production cost calculation request
router.post('/REQ_PRODUCTION_COST_CALCULATION', function (req, res)
{
    var tcpClass = new TcpClass(SBTOptions);
    console.log("REQ_PRODUCTION_COST_CALCULATION " + req.ip);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);

    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    var makeRequest = {
        request: "8011:REQ_PRODUCTION_COST_CALCULATION",
        reqIp: req.ip,
        username: req.body.username,
        token: session.token,
        scenario: req.body.scenario,
        case: req.body.case
    };
    tcpClass.makeHttpsRequest(makeRequest);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                res.send(tcpClass.getHttpsResponse());
                res.end();
                delete tcpClass;
            });


});

//Process request to get production cost data
router.post('/REQ_PRODUCTION_COST_DATA', function (req, res)
{
    var tcpClass = new TcpClass(SBTOptions);
    console.log("REQ_PRODUCTION_COST_DATA " + req.ip);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);

    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }

    var makeRequest = {
        request: "8012:REQ_PRODUCTION_COST_DATA",
        reqIp: req.ip,
        username: req.body.username,
        token: session.token,
        scenario: req.body.scenario,
        case: req.body.case
    };
    tcpClass.makeHttpsRequest(makeRequest);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);

    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                res.send(tcpClass.getHttpsResponse());
                res.end();
                delete tcpClass;
            });

});

/************************************************************************/
//Get data from Production Cost with ESS result
var data = [];
var test1 = false;
var temp_array = [];



router.post('/REQ_GET_PRODUCTION_COST_RESULTS', function (req, res) {
    console.log("getting production cost");
    console.log(req.body.PC_generation);
    var tcpClass = new TcpClass(SBTOptions);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);


    temp_array = [];
    temp_array.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_generation);
    temp_array.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_primres);
    temp_array.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_secres);
    temp_array.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_tertres);
    temp_array.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_enerprice);
    temp_array.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_resprice);
    getProductionCostData(data, temp_array, 0);
    waitUntil()
            .interval(1000)
            .times(10000)
            .condition(function () {

                return (test1 ? true : false);
            })
            .done(function (result) {
                res.send(data);
                res.end();
            });
});


var check = false;
var getProductionCostData = function (data, temp_array, index)
{

    getDataFromFiles(temp_array[index], data[index]);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (check ? true : false);
            })
            .done(function (result) {

                console.log(temp_array[index] + ":" + index);
                data[index] = holding_array;
                console.log("data " + data[index].length);
                var i = ++index;
                if (index < temp_array.length)
                    getProductionCostData(data, temp_array, i);
                else
                    test1 = true;
            });

};
var holding_array;
var getDataFromFiles = function (file, array)
{
    holding_array = [];

    if (fs.existsSync(file))
    {
        check = false;
        var rd = readline.createInterface({
            input: fs.createReadStream(file),
            output: process.stdout,
            console: false
        });

        rd.on('line', function (line) {
            holding_array.push(line);
        });

        rd.on('close', function () {
            check = true;
        });
    } else
    {
        check = true;
    }


};

/***************************************************/
//Get data from Production Cost No ESS results
var data_noess = [];
var test1_noess = false;
var temp_array_noess = [];
//Process request to get data from csv files generated from production cost calculation
router.post('/REQ_GET_PRODUCTION_COST_NOESS_RESULTS', function (req, res) {
    console.log("getting production cost Noess");

    var tcpClass = new TcpClass(SBTOptions);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);


    temp_array_noess = [];
    temp_array_noess.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_generation);
    temp_array_noess.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_primres);
    temp_array_noess.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_secres);
    temp_array_noess.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_tertres);
    temp_array_noess.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_enerprice);
    temp_array_noess.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.PC_resprice);
    getProductionCostNoESSData(data_noess, temp_array_noess, 0);
    waitUntil()
            .interval(1000)
            .times(10000)
            .condition(function () {

                return (test1_noess ? true : false);
            })
            .done(function (result) {
                res.send(data_noess);
                res.end();
            });
});


var check_noess = false;
var getProductionCostNoESSData = function (data_noess, temp_array_noess, index)
{

    getPCNoESSDataFromFiles(temp_array_noess[index], data_noess[index]);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (check_noess ? true : false);
            })
            .done(function (result) {

                console.log(temp_array_noess[index] + ":" + index);
                data_noess[index] = holding_array_noess;
                console.log("data " + data_noess[index].length);
                var i = ++index;
                if (index < temp_array_noess.length)
                    getProductionCostNoESSData(data_noess, temp_array_noess, i);
                else
                    test1_noess = true;
            });

};
var holding_array_noess;
var getPCNoESSDataFromFiles = function (file, array)
{
    holding_array_noess = [];

    if (fs.existsSync(file))
    {
        check_noess = false;
        var rd = readline.createInterface({
            input: fs.createReadStream(file),
            output: process.stdout,
            console: false
        });

        rd.on('line', function (line) {
            holding_array_noess.push(line);
        });

        rd.on('close', function () {
            check_noess = true;
        });
    } else
    {
        check_noess = true;
    }

};

/*************************************************/
//Get data from Emulator With ESS results
var data_em = [];
var test1_em = false;
var temp_array_em = [];

//Process request to get data from csv files generated from emulator calculation
router.post('/REQ_GET_EMULATOR_RESULTS', function (req, res) {

    var tcpClass = new TcpClass(SBTOptions);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);

    console.log("Creating temp_array_em");
    temp_array_em = [];
    temp_array_em.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.EM_generation);
    temp_array_em.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.EM_primres);
    temp_array_em.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.EM_secres);
    temp_array_em.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.EM_tertres);
    getEmulatorData(data_em, temp_array_em, 0);
    waitUntil()
            .interval(1000)
            .times(10000)
            .condition(function () {

                return (test1_em ? true : false);
            })
            .done(function (result) {
                res.send(data_em);
                res.end();
            });
});


var check_em = false;
var getEmulatorData = function (data_em, temp_array_em, index)
{
    console.log("Getting Emulator data");
    getEMDataFromFiles(temp_array_em[index], data_em[index]);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (check_em ? true : false);
            })
            .done(function (result) {

                console.log(temp_array_em[index] + ":" + index);
                data_em[index] = holding_array_em;
                console.log("data " + data_em[index].length);
                var i = ++index;
                if (index < temp_array_em.length)
                    getEmulatorData(data_em, temp_array_em, i);
                else
                    test1_em = true;
            });

};

var holding_array_em;
var getEMDataFromFiles = function (file, array)
{
    holding_array_em = [];

    if (fs.existsSync(file))
    {
        check_em = false;
        var rd = readline.createInterface({
            input: fs.createReadStream(file),
            output: process.stdout,
            console: false
        });

        rd.on('line', function (line) {
            holding_array_em.push(line);
        });

        rd.on('close', function () {
            check_em = true;
        });
    } else
    {
        check_em = true;
    }

};

/******************************************************/
//Get data from Emulator No ESS results
var data_em_noess = [];
var test1_em_noess = false;
var temp_array_em_noess = [];

//Process request to get data from csv files generated from emulator calculation
router.post('/REQ_GET_EMULATOR_NOESS_RESULTS', function (req, res) {

    var tcpClass = new TcpClass(SBTOptions);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);

    console.log("Creating temp_array_em");
    temp_array_em_noess = [];
    temp_array_em_noess.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.EM_generation);
    temp_array_em_noess.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.EM_primres);
    temp_array_em_noess.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.EM_secres);
    temp_array_em_noess.push("/home/gonzales1609/IRENA/SBT_Api/" + req.body.EM_tertres);
    getEmulatorData(data_em_noess, temp_array_em_noess, 0);
    waitUntil()
            .interval(1000)
            .times(10000)
            .condition(function () {

                return (test1_em_noess ? true : false);
            })
            .done(function (result) {
                res.send(data_em_noess);
                res.end();
            });
});


var check_em_noess = false;
var getEmulatorNoESSData = function (data_em_noess, temp_array_em_noess, index)
{
    console.log("Getting Emulator data");
    getEMNoESSDataFromFiles(temp_array_em_noess[index], data_em_noess[index]);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (check_em_noess ? true : false);
            })
            .done(function (result) {

                console.log(temp_array_em_noess[index] + ":" + index);
                data_em_noess[index] = holding_array_em_noess;
                console.log("data " + data_em_noess[index].length);
                var i = ++index;
                if (index < temp_array_em_noess.length)
                    getEmulatorNoESSData(data_em_noess, temp_array_em_noess, i);
                else
                    test1_em_noess = true;
            });

};

var holding_array_em_noess;
var getEMNoESSDataFromFiles = function (file, array)
{
    holding_array_em_noess = [];
    if (fs.existsSync(file))
    {
        check_em_noess = false;
        var rd = readline.createInterface({
            input: fs.createReadStream(file),
            output: process.stdout,
            console: false
        });

        rd.on('line', function (line) {
            holding_array_em_noess.push(line);
        });

        rd.on('close', function () {
            check_em_noess = true;
        });
    } else
    {
        check_em_noess = false;
    }
};


//Process request to start stacked benefits calculation
router.post('/REQ_STACKED_BENEFITS_CALCULATION', function (req, res)
{
    var tcpClass = new TcpClass(SBTOptions);
    console.log("REQ_STACKED_BENEFITS_CALCULATION " + req.ip);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);

    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    var makeRequest = {
        request: "8013:REQ_STACKED_BENEFITS_CALCULATION",
        reqIp: req.ip,
        username: req.body.username,
        token: session.token,
        scenario: req.body.scenario,
        case: req.body.case
    };
    tcpClass.makeHttpsRequest(makeRequest);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                res.send(tcpClass.getHttpsResponse());
                res.end();
                delete tcpClass;
            });
});
//Process request to get data generated from stacked benefits calculation
router.post('/REQ_STACKED_BENEFITS_DATA', function (req, res)
{
    var tcpClass = new TcpClass(SBTOptions);
    console.log("REQ_STACKED_BENEFITS_DATA " + req.ip);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);
    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    var makeRequest = {
        request: "8014:REQ_STACKED_BENEFITS_DATA",
        reqIp: req.ip,
        username: req.body.username,
        token: session.token,
        scenario: req.body.scenario,
        case: req.body.case
    };
    tcpClass.makeHttpsRequest(makeRequest);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);
    waitUntil()
            .interval(1000)
            .times(100)
            .condition(function () {
                console.log(tcpClass.isClosed());
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                res.send(tcpClass.getHttpsResponse());
                res.end();
                delete tcpClass;
            });
});

/*******************************************************/
//Process request to start emulator calculation
router.post('/REQ_EMULATOR_CALCULATION', function (req, res)
{
    var tcpClass = new TcpClass(SBTOptions);
    console.log("REQ_EMULATOR_CALCULATION " + req.ip);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);
    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    var makeRequest = {
        request: "8015:REQ_EMULATOR_CALCULATION",
        reqIp: req.ip,
        username: req.body.username,
        token: session.token,
        scenario: req.body.scenario,
        case: req.body.case
    };
    tcpClass.makeHttpsRequest(makeRequest);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);
    waitUntil()
            .interval(1000)
            .times(100)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                res.send(tcpClass.getHttpsResponse());
                res.end();
                delete tcpClass;
            });
});
//Process request to get data generated from emulator calculation
router.post('/REQ_EMULATOR_DATA', function (req, res)
{
    var tcpClass = new TcpClass(SBTOptions);
    console.log("REQ_EMULATOR_DATA " + req.ip);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);
    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    var makeRequest = {
        request: "8016:REQ_EMULATOR_DATA",
        reqIp: req.ip,
        username: req.body.username,
        token: session.token,
        scenario: req.body.scenario,
        case: req.body.case
    };
    tcpClass.makeHttpsRequest(makeRequest);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                res.send(tcpClass.getHttpsResponse());
                res.end();
                delete tcpClass;
            });
});
//Process request to get all scenarios and cases for the current user
router.post('/REQ_PROJECTS_AND_RUNS', function (req, res) {
    console.log("- REQ_PROJECTS_AND_RUNS >> " + req.ip);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);
    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        res.end();
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    var tcpClass = new TcpClass(SBTOptions);
    console.log("- REQ_PROJECTS_AND_RUNS >> REQUESTING FTP CALL " + req.ip);
    var makeRequest = {
        request: "8000:REQ_PROJECTS_AND_RUNS",
        reqIp: req.ip,
        username: req.body.username,
        token: session.token
    };
    tcpClass.makeHttpsRequest(makeRequest);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                res.send(tcpClass.getHttpsResponse());
                res.end();
                delete tcpClass;
            });
});
//Process request to get the data for the current selected case
router.post("/REQ_GET_RUN_DATA", function (req, res) {
    console.log("- REQ_GET_RUN_DATA " + req.ip);
    var tcpClass = new TcpClass(SBTOptions);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);
    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }

    console.log("- REQ_GET_RUN_DATA >> REQUESTING FTP CALL " + req.ip);
    var makeRequest = {
        request: "8007:REQ_GET_RUN_DATA",
        reqIp: req.ip,
        username: req.body.username,
        token: session.token,
        scenario: req.body.scenario,
        case: req.body.case
    };
    tcpClass.makeHttpsRequest(makeRequest);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                //console.log(tcpClass.getHttpsResponse().toString());
                ProcessResponse(tcpClass.getHttpsResponse(), req, res);
                delete tcpClass;
            });
});
// req force save the data from the input fields
router.post("/REQ_FORCE_SAVE_DATA", function (req, res) {
    console.log("- REQ_FORCE_SAVE_DATA " + req.ip);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);
    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    var tcpClass = new TcpClass(SBTOptions);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                ProcessResponse(tcpClass.getHttpsResponse(), req, res);
                res.end();
                delete tcpClass;
            });
});
//save inputs

//save inputs
router.post('/REQ_SAVE_DATA', function (req, res) {
    console.log(" - REQ_SAVE_DATA " + req.ip);
    var tcpClass = new TcpClass(SBTOptions);
    var index = userSessions.getUserNameIndexByPort(req.app.settings.port, req.ip);
    var resp = {};
    resp.response = "INVALID_OPERATION";
    resp.url = url;
    if (index === -1)
    {
        res.send(resp);
        console.log(" >> GET USERNAME BY PORT IN NULL " + req.app.settings.port);
        return;
    }
    var session = userSessions.getSessionByIndex(index);
    if (userSessions.ValidateSessionByIp1(session, req.ip, req.app.settings.port) === -1)
    {
        console.log(" >> VALIDATE SESSION BY IP IS NULL");
        res.send(resp);
        res.end();
        return;
    }
    console.log("- REQ_SAVE_DATA " + req.ip);
    var inputsObj = req.body;
    inputsObj.request = "8002:REQ_SAVE_DATA";
    inputsObj.token = session.token;
    console.log(JSON.stringify(inputsObj));
    tcpClass.makeHttpsRequest(inputsObj);
    console.log(" - TCP CALL REQUESTED >> " + req.ip);
    waitUntil()
            .interval(1000)
            .times(1000)
            .condition(function () {
                return (tcpClass.isClosed() ? true : false);
            })
            .done(function (result) {
                if (tcpClass.hasError())
                {


                    res.send(tcpClass.getHttpsResponse());
                    res.end();
                    return;
                }
                ProcessResponse(tcpClass.getHttpsResponse(), req, res);
                res.end();
                delete tcpClass;
            });
    /*
     saveInputs.es_save_to_db(req, function (err, slt_input) {
     
     try {
     var resBody = {success: 'false'};
     res.setHeader("Content-Type", "application/json");
     if (err) {
     console.log('Error!!!!');
     console.log(err);
     resBody.error = 'server error' + err;
     resBody.success = false;
     
     res.write(JSON.stringify(resBody));
     res.end();
     return;
     } else {
     
     
     //                            var reqAPI = https.request(options, function (resAPI) {
     //                                //console.log('Status: ' + resAPI.statusCode);
     //                                resAPI.setEncoding('utf8');
     //
     //                                resAPI.on('data', function (body) {
     //
     //
     //                                    body.success = true;
     //
     //                                    //console.log(body)
     //                                    if (err) {
     //                                        console.log('Error!!!!');
     //                                        console.log(err)
     //                                        body.error = err;
     //                                        body.success = false;
     //                                    }
     //
     //                                    res.on('error', function (e) {
     //                                        console.log('problem with request1: ' + e.message);
     //                                    });
     //
     //                                    res.write(body);
     //                                    res.end();
     //
     //                                });
     //                            });
     //                            reqAPI.on('error', function (e) {
     //                                console.log('problem with request: ' + e.message);
     //                            });
     
     }
     } catch (err) {
     body = {
     error: err.message,
     success: false
     }
     
     res.on('error', function (e) {
     console.log('problem with request1: ' + e.message);
     });
     
     
     res.write(JSON.stringify(body));
     res.end();
     }
     
     
     });
     
     req.on(
     'error',
     function (e) {
     res.setHeader("Content-Type", "application/json");
     res.write(JSON.stringify(e));
     res.end();
     }
     );
     
     }
     */
});
/*
 //Load output graphs
 router.post('/REQ_OUTPUT_CHARTS',function(req,res){
 var username = req.username;
 var current_scenario = req.scenario;
 var current_case = req.case;
 var filePath = '/opt/OutputCharts/'+username+'/'+current_scenario+'/'+current_case+'/';
 
 
 loadChart(filePath,"PC_generation.csv","genprofilechart","area");
 loadChart(filePath,"PC_primres.csv","primreschart","area");
 loadChart(filePath,"PC_secres.csv","secreschart","area");
 loadChart(filePath,"PC_terres.csv","terreschart","area");
 loadChart(filePath,"PC_enerprice","enerpriceprofilechart","line");
 loadChart(filePath,"PC_resprice.csv","respricechart","line");
 
 
 });
 
 var loadChart = function(filePath,fileName,chart_id, chart_type){
 var element = document.getElementById(chart_id);
 fs.readFile(filePath+fileName,'utf8',function(err,data){
 if(err){
 throw err;
 }
 });
 var data;
 if(chart_type==="line")
 {
 g = new Dygraph(element, data,
 {
 rollPeriod: 2,
 showRoller: true,
 animatedZooms: true
 }
 }
 else if(chart_type==='area')
 {
 var g = new Dygraph(
 element,
 data,
 {
 width: 1000,
 height: 300,
 stackedGraph: true,
 
 highlightCircleSize: 2,
 strokeWidth: 1,
 strokeBorderWidth: null,
 
 highlightSeriesOpts: {
 strokeWidth: 3,
 strokeBorderWidth: 1,
 highlightCircleSize: 5
 }
 });
 
 var onclick = function(ev) {
 if (g.isSeriesLocked()) {
 g.clearSelection();
 } else {
 g.setSelection(g.getSelection(), g.getHighlightSeries(), true);
 }
 };
 g.updateOptions({clickCallback: onclick}, true);
 
 }
 };
 */

//Function to test if the current session is valid
var TestForValidAPISession = function (msg, res)
{
    var status = false;
    console.log(JSON.stringify(msg.response));
    if (msg.response === "1000:ERR_INVALID_SESSION")
    {

        status = true;
        var index = userSessions.getUserNameIndexByPort(msg.port, msg.userIp);
        extIP.get().then(ip => {


            var url = "https://www.stacked-services.com";
            msg.url = url;
            res.send(msg);
        }, err => {
            console.error(err);
        });
    }
    if (msg.response === "2000:ERR_EXPIRED_SESSION")
    {
        status = true;
        res.send(msg);
    }
    return status;
};
var find = function (element, word)
{
    for (var i = 0; i < word.length; i++)
    {
        if (word[i] === element)
            return 1;
    }
    return -1;
}
/*
 * Processes the Event requested from the client
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
var ProcessRequest = function (session, req, res)
{
    console.log(">> ProcessRequest ", req.ip);
    var requestType = req.url.split("/");
    if (requestType[1] === 'REQ_ALTERNATIVE_ANALYSIS_DATA')
    {

    } else if (requestType[1] === 'REQ_ALTERNATIVE_ANALYSIS_CALCULATION')
    {
        console.log("in");
        var makeRequest = {
            request: "8004:REQ_ALTERNATIVE_ANALYSIS_CALCULATION",
            reqIp: req.ip,
            username: session.username,
            token: session.token,
            scenario: req.body.scenario,
            case: req.body.case
        };
        TcpCall.makeHttpsRequest(makeRequest);
        console.log(" - TCP CALL REQUESTED >> " + req.ip);
    } else if (requestType[1] === 'REQ_FORCE_SAVE_DATA')
    {
        var makeRequest = {
            request: "8009:REQ_FORCE_SAVE_DATA",
            reqIp: req.ip,
            username: session.username,
            token: session.token,
            scenario: req.body.project,
            case: req.body.run
        };
    } else if (requestType[1] === "REQ_DELETE")
    {

    } else if (requestType[1] === "REQ_CREDENTIAL_VALIDATION")
    {


    } else if (requestType[1] === 'REQ_SYSTEM_BENEFFITS_TOOL')
    {
        console.log("- REQ_SYSTEM_BENEFFITS_TOOL >> STARTING SESSION FOR " + req.ip);
        res.render('index', {username: session.username});
        var makeRequest = {
            request: "8008:REQ_SET_SESSION_PORT",
            reqIp: req.ip,
            username: session.username,
            token: session.token
        };
        console.log(session.token);
        console.log(">> REQ_SET_SESSION_PORT " + req.ip);
        TcpCall.makeHttpsRequest(makeRequest);
        console.log(" - TCP CALL REQUESTED >> " + req.ip);
    } else if (requestType[1] === 'REQ_PROJECTS_AND_RUNS')
    {

        console.log("- REQ_PROJECTS_AND_RUNS >> REQUESTING FTP CALL " + req.ip);
        var makeRequest = {
            request: "8000:REQ_PROJECTS_AND_RUNS",
            reqIp: req.ip,
            username: session.username,
            token: session.token
        };
        TcpCall.makeHttpsRequest(makeRequest);
        console.log(" - TCP CALL REQUESTED >> " + req.ip);
    } else if (requestType[1] === 'REQ_GET_RUN_DATA')
    {
        console.log("- REQ_GET_RUN_DATA >> REQUESTING FTP CALL " + req.ip);
        var index = userSessions.findSessionUserIp(req.ip);
        var session = userSessions.getSessionByIndex(index);
        var makeRequest = {
            request: "8007:REQ_GET_RUN_DATA",
            reqIp: req.ip,
            username: session.username,
            token: session.token,
            scenario: req.body.scenario,
            case: req.body.case
        };
        TcpCall.makeHttpsRequest(makeRequest);
        console.log(" - TCP CALL REQUESTED >> " + req.ip);
    } else if (requestType[1] === 'REQ_SAVE_DATA')
    {
        console.log("- REQ_SAVE_DATA " + req.ip);
        var inputsObj = req.body;
        inputsObj.request = "8002:REQ_SAVE_DATA";
        inputsObj.username = session.username;
        inputsObj.token = session.token;
        console.log(JSON.stringify(inputsObj));
        TcpCall.makeHttpsRequest(inputsObj);
        console.log(" - TCP CALL REQUESTED >> " + req.ip);
    }

};
/*
 * Process the response from the SBT_API
 * @param {type} sessions
 * @param {type} data
 * @param {type} res
 * @returns {undefined}
 */
var ProcessResponse = function (data, req, res)
{
    console.log(data);
    var obj = JSON.parse(data);
    console.log("- Process response for " + req.ip);
    if (!(typeof obj.response === 'undefined'))
    {
        var obj = JSON.parse(JSON.stringify(data));
        console.log(" >> RESPONSE VALIDATED");
        console.log(data);
        obj = JSON.parse(obj);
        if (obj.response === "7000:CREDENTIAL_ACCEPTED")
        {
            console.log("- Accepted >> " + obj.username);
            userSessions.findUserName(obj.username);
            waitUntil()
                    .interval(100)
                    .times(10)
                    .condition(function () {
                        return (userSessions.getStatus ? true : false);
                    })
                    .done(function (result) {
                        if (userSessions.getDbRows().length > 0)
                            ReactivateSession(res, obj);
                        else
                            SetUpInstance(req, res, obj);
                    });
        } else if (obj.response === "7001:SUCCESS_REQUEST")
        {
            var response = req.url.split("/");
            if (response[1] === "REQ_PROJECTS_AND_RUNS")
            {
                res.send(obj);
                res.end();
            }
            if (response[1] === "REQ_GET_RUN_DATA")
            {
                res.send(obj);
                res.end();
            }
            if (response[1] === "REQ_SAVE_DATA")
            {
                res.send(obj);
                res.end();
            }
            if (response[1] === "REQ_FORCE_SAVE_DATA")
            {
                extIP.get().then(ip => {


                    var url = "https://www.stacked-services.com";
                    msg.url = url;
                    res.send(msg);
                }, err => {
                    console.error(err);
                });
            }

        } else
        {
            //if (!TestForValidAPISession(obj, res))
            res.send(obj);
        }
    } else
    {
        console.log(" - Error");
        res.send(data);
    }


};
var Test_Response = function (object)
{
    var stringConstructor = "test".constructor;
    var arrayConstructor = [].constructor;
    var objectConstructor = {}.constructor;
    if (object === null) {
        this.response = "null";
        return 0;
    } else if (object === undefined) {
        this.response = "undefined";
        return 1;
    } else if (object.constructor === this.stringConstructor) {
        this.response = "String";
        return 2;
    } else if (object.constructor === this.arrayConstructor) {
        this.response = "Array";
        return 3;
    } else if (object.constructor === this.objectConstructor) {
        this.response = "Object";
        return 4;
    } else {
        return "don't know";
    }
};
var ReactivateSession = function (res, jsonObj)
{
    console.log("- Reactivating Session for username >> " + jsonObj.username);
    var port = userSessions.ReactivateSession(jsonObj, ((Math.round(new Date().getTime() / 1000) + (86400 / 2))));
    res.send({response: jsonObj.response, port: port, url: url});
    res.end();
};
var SetBackEndInstance = function (ip, res, obj)
{
    console.log("- SetUpBackEndInstance " + ip);
    portfinder.getPort(function (err, port)
    {

        while (userSessions.findPort(port) !== -1)
        {
            console.log(">> Busy port:" + port);
            port += 1;
        }
        userSessions.SetSession1(res, obj.username, obj.token, ip, ((Math.round(new Date().getTime() / 1000) + (86400 / 2))), port);
        console.log('>> Starting Session for' + ip + " on port " + port);
        ActivateServer(port);
    });
};
var ReactivateBackEndSession = function (res, jsonObj)
{
    console.log("- Reactivating Session for username >> " + jsonObj.username);
    userSessions.ReactivateSession1(res, jsonObj, ((Math.round(new Date().getTime() / 1000) + (86400 / 2))));
};
/*
 * This function sets up the and instantiates the port and to the
 * server.
 * It makes system calls in order to start the new server with the
 * assigned port
 * it renders the instantiate-instance.pug page that handles the call
 * to the backend with the new port and instance assigned
 * @param {type} res
 * @returns {undefined}
 */
var SetUpInstance = function (ip, res, jsonObj)
{
    console.log("- SetUpInstance " + ip);
    portfinder.getPort(function (err, port)
    {
        console.log("- SetUpInstance on port " + port);
        while (userSessions.findPort(port) !== -1)
        {
            console.log(">> Busy port:" + port);
            port += 1;
        }
        userSessions.SetSession(jsonObj.username, jsonObj.token, ip, ((Math.round(new Date().getTime() / 1000) + (86400 / 2))), port);
        res.send({response: jsonObj.response, port: port, url: url});
        res.end();
        console.log('>> Starting Session for' + ip + " on port " + port);
        ActivateServer(port);
    });
};
//Function to create a new session and activate server, ex: www__8000.js where 8000 is the port given to the user at login
//A new www__8***.js file is created and executed similar to www.js except on a different port
var ActivateServer = function (port)
{
    console.log("- Activating server on port " + port);
    fs.writeFileSync('/home/gonzales1609/IRENA/SBT/bin/www__' + port + ".js",
            "#!/usr/bin/env node \n"

            + "/** \n"
            + "* Module dependencies.\n"
            + "*/ \n"

            + "var app = require('../app'); \n"
            + "var debug = require('debug')('irena:server'); \n"
            + "var https = require('https'); \n"
            + "var fs = require('fs'); \n"
            + 'var config = require("../routes/config"); \n'

            + "/** \n"
            + "* Get port from environment and store in Express. \n"
            + "*/ \n"

            + "console.log(config); \n"

            + "var port = normalizePort(process.env.PORT ||" + port + "); \n"
            + "app.set('port', port); \n"

            + "/** \n"
            + "* Create HTTPS server. \n"
            + " */ \n"

            + "var options = { \n"
            + "key: fs.readFileSync('/etc/ssl/keys/www.stacked-services.com.key', 'utf8'), \n"
            + "cert: fs.readFileSync('/etc/ssl/certs/www.stacked-services.com.chained.crt', 'utf8'), \n"
            + "passphrase: 'qazwsx@1' \n"
            + "}; \n"

            + "var server = https.createServer(options, app); \n"




            + "/** \n"
            + "* Listen on provided port, on all network interfaces. \n"
            + " */ \n"

            + "server.listen(port); \n"
            + "server.on('error', onError); \n"
            + "server.on('listening', onListening); \n"

            + "/** \n"
            + "* Normalize a port into a number, string, or false. \n"
            + "*/ \n"

            + "function normalizePort(val) { \n"
            + "var port = parseInt(val, 10); \n"

            + "if (isNaN(port)) { \n"
            + "    // named pipe \n"
            + "    return val; \n"
            + "  } \n"

            + "  if (port >= 0) { \n"
            + "    // port number \n"
            + "    return port; \n"
            + "} \n"

            + "return false; \n"
            + "} \n"



            + "function onError(error) { \n"
            + "if (error.syscall !== 'listen') { \n"
            + "throw error; \n"
            + "} \n"

            + "var bind = typeof port === 'string' \n"
            + "? 'Pipe ' + port \n"
            + ": 'Port ' + port; \n"


            + "  switch (error.code) { \n"
            + "    case 'EACCES': \n"
            + "      console.error(bind + ' requires elevated privileges'); \n"
            + "      process.exit(1); \n"
            + "      break; \n"
            + "    case 'EADDRINUSE': \n"
            + "    console.error(bind + ' is already in use'); \n"
            + "    process.exit(1); \n"
            + "    break; \n"
            + "    default: \n"
            + "    throw error; \n"
            + " } \n"
            + "} \n"



            + "function onListening() { \n"
            + "var addr = server.address(); \n"
            + "console.log('addr'+addr.port); \n"
            + "var bind = typeof addr === 'string' \n"
            + "? 'pipe ' + addr \n"
            + ": 'port ' + addr.port; \n"
            + "debug('Listening on ' + bind); \n"
            + "} \n"

            );
    fs.writeFileSync('/home/gonzales1609/IRENA/Instances/www__' + port + ".sh",
            "#! /bin/sh \n"
            + "sudo pm2 start /home/gonzales1609/IRENA/SBT/bin/www__" + port + ".js");
    while (!fs.existsSync("/home/gonzales1609/IRENA/Instances/www__" + port + ".sh") ? true : false) {
    }
    var child;
    child = exec("sudo chmod -R ugo+rw /home/gonzales1609/IRENA/Instances/www__" + port + ".sh", function (error, stdout, stderr) {
        console.log('>> Giving Read Write previlious');
        if (error !== null) {
            console.log('exec error: ' + error);
        }



        child = exec("sudo chmod +x /home/gonzales1609/IRENA/Instances/www__" + port + ".sh", function (error, stdout, stderr) {
            console.log('>> Making executable');
            if (error !== null) {
                console.log('exec error: ' + error);
            }

            child = exec("/home/gonzales1609/IRENA/Instances/./www__" + port + ".sh", function (error, stdout, stderr) {
                console.log('launching the file on port ' + port);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        });
    });
};
/*
 * getting wiki path for project
 
 */

//Open Wiki page
router.get('/REQ_WIKI_PAGE', function (req, res) {
    console.log(" >> getting dictionary path " + APIconfig.wiki['url']);
    res.send(APIconfig.wiki['url']);
    res.end();
});
/* GET test page. */
router.get(
        '/test',
        function (req, res, next) {
            res.send("welcome");
            res.end();
        }
);
/* GET test page. */
router.get(
        '/user-guide',
        function (req, res, next) {
            res.render('help-forms/user-guide', {
                title: 'Acelerex',
            })
        }
);
/* GET index page. */
router.get(
        '/inputs',
        function (req, res, next) {
            res.render('index', {title: 'Acelerex'});
        }
);
/* GET Data Dictionary Page. */
// router.get('/data-dictionary', function (req, res, next) {
//   res.render('sub-forms/data-dictionary', { title: 'Express' });
// });

// /* GET User Guide Page. */
// router.get('/user-guide', function (req, res, next) {
//   res.render('sub-forms/user-guide', { title: 'User Guide' });
// });

/* GET Inputs Page. */
router.get('/index', function (req, res, next) {
    res.render('views/index', {title: 'Inputs'});
});



////start calculation
//router.post(
//        '/calculate-valuation',
//        function (req, res) {
//            console.log('Calculate called, body: ' + JSON.stringify(req.body));
//
//            //CALL API
//            var reqAPI = https.request(
//                    options,
//                    function (resAPI) {
//                        resAPI.setEncoding('utf8');
//                        resAPI.on(
//                                'data',
//                                function (body) {
//                                    console.log("reAPI /calculate-valuation: " + JSON.stringify(body));
//                                    res.setHeader("Content-Type", "application/json");
//                                    res.write(JSON.stringify(body));
//                                    res.end();
//                                }
//                        );
//                    }
//            );
//
//            reqAPI.on(
//                    'error',
//                    function (e) {
//                        res.setHeader("Content-Type", "application/json");
//                        res.write(JSON.stringify(e));
//                        res.end();
//                    }
//            );
//
//            req.body.action = "CALCULATE";
//            reqAPI.write(JSON.stringify(req.body));
//            reqAPI.end();
//        }
//);
//
//
////get project and run info this function
//
//
////get input profiles
//router.post(
//        '/get-input-profiles',
//        function (req, res) {
//            console.log("/get-input-profiles");
//            var paths = [
//                {
//                    'path': req.body.path,
//                    'col': 0
//                }];
//
//            utils.readProfiles(paths, function (err, results) {
//
//                res.setHeader("Content-Type", "application/json");
//                var body = {status: 'false'};
//
//                if (err) {
//                    console.log('Some error');
//
//                    res.write(JSON.stringify(body));
//                    res.end();
//                    return;
//                }
//
//
//                body.status = true;
//                body.profile = results[0];
//
//                res.write(JSON.stringify(body));
//                res.end();
//
//            });
//
//        }
//);
//
//
////get output profiles
//router.post(
//        '/get-output-profiles',
//        function (req, res) {
//            var key = 'Price_year';
//            // var reqParsed = JSON.parse(req.body);
//            var OutFiles = req.body.paths;
//            // console.log(OutFiles);
//
//
//            var paths = [
//                {
//                    'path': OutFiles['yearly'][req.body.year]['base'][key + '_base'],
//                    'col': req.body.col
//                },
//                {
//                    'path': OutFiles['yearly'][req.body.year]['es'][key],
//                    'col': req.body.col
//                }
//            ]
//
//            utils.readProfiles(paths, function (err, results) {
//
//                res.setHeader("Content-Type", "application/json");
//                var body = {status: 'false'};
//
//                if (err) {
//                    console.log('Some error');
//
//                    res.write(JSON.stringify(body));
//                    res.end();
//                    return;
//                }
//                results[0].shift();
//                results[0].map(Date);
//
//                var newArray = results[0].map(function (col, i) {
//                    return i + ',' + results.map(function (row) {
//                        return row[i];
//                    }).toString();
//                });
//
//                newArray.unshift("Hour, Base, With Storage");
//                body.status = true;
//                body.profile = newArray;
//
//                res.write(JSON.stringify(body));
//                res.end();
//
//            });
//
//
//        }
//);
//
////get output gen by fuel type
//router.post(
//        '/get-output-generation',
//        function (req, res) {
//            console.log('reading body')
//
//            console.log(req.body);
//
//            var key = 'p_con_year';
//            var path_local = [];
//
//            path_local.push({
//                'path': req.body.hydro,
//                'col': 0
//            });
//
//            path_local.push({
//                'path': req.body.solar,
//                'col': 0
//            });
//
//            path_local.push({
//                'path': req.body.wind,
//                'col': 0
//            });
//
//
//            for (y = 0; y < 10; y++) {
//                path_local.push({
//                    'path': req.body.conventional,
//                    'col': y
//                });
//            }
//
//
//
//            utils.readProfiles(path_local, function (err, results) {
//
//                res.setHeader("Content-Type", "application/json");
//                var body = {status: 'false'};
//
//                if (err) {
//                    console.log('Some error');
//
//                    res.write(JSON.stringify(body));
//                    res.end();
//                    return
//                }
//
//                var colnames = req.body.colnames;
//                var newArray = results.map(function (row, k) {
//                    return [colnames[k],
//                        row.reduce(function (sum, value) {
//                            return sum + Number(value);
//                        }, 0)
//                    ]
//                });
//
//
//                newArray[1][1] *= req.body.solarcap;
//                newArray[2][1] *= req.body.windcap;
//
//                body.status = true;
//                body.generation = newArray;
//
//                res.write(JSON.stringify(body));
//                res.end();
//
//            })
//
//
//        }
//)
//
////get zipped files
//router.get('/get-outputs-zip',
//        function (req, res) {
//
//            var folderpath = path.join(APIconfig.datafiles.path,
//                    req.query.username, req.query.project, req.query.run);
//
//
//            //req.query.path;//'/opt/slt_data/alevo/irena/run_test';
//
//
//
//            console.log('getting body of outputs-zip');
//            console.log(req.query);
//            console.log('path');
//            console.log(folderpath);
//
//            res.setHeader('Content-Type', 'application/zip');
//            res.set('Content-Disposition', 'attachment; filename=myFile.zip');
//
//            const zipfile = archiver('zip');
//            zipfile.on('error', function (err) {
//                res.status(500).send({error: err.message});
//            });
//
//            //on stream closed we can end the request
//            zipfile.on('end', function () {
//                console.log('Archive wrote %d bytes', zipfile.pointer());
//            });
//            //this is the streaming magic
//            zipfile.pipe(res);
//            //set the archive name
//            res.attachment('Outputs-files.zip');
//
//            zipfile.directory(folderpath, 'SLT-files');
//            zipfile.finalize();
//        }
//)
//
////save temporary user-defined profiles
//router.post(
//        '/save_user_profile',
//        function (req, res) {
//            console.log("save_user_profile");
//            //    console.log(req.body);
//            if (req.body.userdemandprofile != "") {
//                var bob = Math.random().toString(36).substring(7);
//                var outfile = "/tmp/" + bob + ".csv";
//                console.log(outfile);
//                var fs = require('fs');
//                fs.writeFile(outfile, req.body.userdemandprofile, function (err) {
//                    if (err) {
//                        return console.log(err);
//                    }
//                    console.log("The file was saved!");
//                });
//            }
//            res.setHeader("Content-Type", "application/json");
//            res.write(JSON.stringify({saved_path: outfile}));
//            res.end();
//        }
//);
//
////load sample runs
//router.post('/get-samples', function (req, res) {
//    //
//    //console.log(req.body)
//    var sampleUser = 'User_Samples_08092017';
//    var reqInputs = {
//        "action": "RETRIEVE_INPUTS",
//        "username": sampleUser,
//        "project": "test",
//        "run": req.body.run
//    };
//
//    var reqOutputs = {
//        "action": "RETRIEVE_RESULTS",
//        "username": sampleUser,
//        "type": "DETAIL",
//        "project": "test",
//        "run": req.body.run
//    };
//    var results = {
//        success: false
//    };
//
//    getInfo(reqInputs, function (err, SLTinputs) {
//
//        if (err) {
//            results = {
//                error: err,
//                success: false
//            }
//            return;
//        }
//
//        results.inputs = JSON.parse(SLTinputs);
//        getInfo(reqOutputs, function (err, SLToutputs) {
//            if (err) {
//                results = {
//                    error: err,
//                    success: false
//                }
//                return;
//            }
//            results.outputs = JSON.parse(SLToutputs);
//            //console.log(results);
//            results.success = true;
//            res.write(JSON.stringify(results));
//            res.end();
//
//
//        });
//    });
//});


module.exports = router;

