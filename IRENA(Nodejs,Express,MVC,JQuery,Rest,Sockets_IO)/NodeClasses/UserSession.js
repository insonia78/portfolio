
var fs = require('fs');
var exec = require('child_process').exec;
var waitUntil = require('wait-until');
var Promise = require("bluebird");
var waitUntil = require('wait-until');
var getCredentialsSqlConnection = require("./credentials_connection_pool");
var SqlString = require('sqlstring');
var extIP = require("ext-ip")();
var url;
extIP.get().then(ip => {
    url = ip;
}, err => {
    console.error(err);
    return;
});
var eventEmitter;
var UserSession = function (EventEmitter)
{
    eventEmitter = new EventEmitter;
    UserSession.sessions = [];
    UserSession.portsListenig = [];
    this.name = "UserSession";
    this.ReadFromSessions();
    console.log("instantitating " + this.name);
};


var status = false;
var dbCall = false;
var dbRow = {};
var makeDbCall = function (query)
{

    dbRow = {};
    dbCall = false;
    Promise.using(getCredentialsSqlConnection(), function (connection) {
        return connection.query(query).then(function (rows) {
            console.log(" >> query performed");

            dbCall = true;
            dbRow = rows;
            return 1;

        }).catch(function (error) {
            console.log(error);
            dbCall = true;
            return 0;

        });
    });
};
/*
 * Accesors
 * @param {type} index
 * @returns {tempSessions|Array}
 */
UserSession.prototype.getStatus = function ()
{
    return status;
};
UserSession.prototype.getSessionByIndex = function (index)
{
    return UserSession.sessions[index];
};
UserSession.prototype.getUserSessions = function ()
{
    return UserSession.sessions;
};
UserSession.prototype.getDbRows = function ()
{
    return dbRow;
};
/*
 * file operations
 * @param {type} session
 * @param {type} ip
 * @returns {undefined}
 */
UserSession.prototype.UpdateSessions1 = function (res, session)
{
    console.log(this.name + " >> Adding Session to Db " + session.userIp);
    var query = SqlString.format("UPDATE SBT_Sessions SET userIp=? where username=?", [session.userIp, session.username]);
    Promise.using(getCredentialsSqlConnection(), function (connection) {
        return connection.query(query).then(function (rows) {
            console.log(" >> query performed");
            res.render('back_end_welcome_page/back_end_welcome_page', {port: session.port, ip: url});
            res.end();
            console.log(" >> query performed");



        }).catch(function (error) {
            res.send(error);
            return 0;

        });
    });

};
UserSession.prototype.UpdateSessions = function (session)
{
    console.log(this.name + " >> Adding Session to Db " + session.userIp);
    var query = SqlString.format("UPDATE SBT_Sessions SET userIp=? where username=?", [session.userIp, session.username]);
    makeDbCall(query);
    waitUntil()
            .interval(100)
            .times(10)
            .condition(function () {
                return (dbCall ? true : false);
            })
            .done(function (result) {

            });

};
UserSession.prototype.AddToSessions1 = function (res, session)
{
    console.log(this.name + " >> Adding Session to Db " + session.userIp);
    var query = SqlString.format("UPDATE SBT_Sessions SET userIp =? ,token = ?, port = ? , timeStamp = ? where username = ?"
            , [session.userIp, session.token, session.port, session.timeStamp, session.username]);

    Promise.using(getCredentialsSqlConnection(), function (connection) {
        return connection.query(query).then(function (rows) {
            console.log(" >> query performed");

            res.render('back_end_welcome_page/back_end_welcome_page', {port: session.port, ip: url});
            res.end();



        }).catch(function (error) {
            console.log(error);
            dbCall = true;
            eventEmitter.emit("database_finished");
            return 0;

        });
    });

};
UserSession.prototype.AddToSessions = function (session)
{
    console.log(this.name + " >> Adding Session to Db " + session.userIp);
    
    console.log(this.name + " >> Adding Session to Db " + session.userIp);
    var query = SqlString.format("UPDATE SBT_Sessions SET userIp =? ,token = ?, port = ? , timeStamp = ? where username = ?"
            , [session.userIp, session.token, session.port, session.timeStamp, session.username]);

    Promise.using(getCredentialsSqlConnection(), function (connection) {
        return connection.query(query).then(function (rows) {
            console.log(" >> query performed");

           



        }).catch(function (error) {
            console.log(error);
            dbCall = true;
            eventEmitter.emit("database_finished");
            return 0;

        });
    });

    /*
    var query = SqlString.format("SELECT * FROM SBT_Sessions where userIp =? AND username=?", [session.userIp, session.username]);
    makeDbCall(query);
    waitUntil()
            .interval(100)
            .times(10)
            .condition(function () {
                return (dbCall ? true : false);
            })
            .done(function (result) {

                if (dbRow.length > 0)
                {
                    console.log(">> UPDATING SESSION");
                    query = SqlString.format("UPDATE SBT_Sessions SET userIp =? ,token = ?, port = ? , timeStamp = ? where username = ?"
                            , [session.userIp, session.token, session.port, session.timeStamp, session.username]);
                    makeDbCall(query);
                } else
                {
                    console.log(">> INSERTING SESSION");
                    query = SqlString.format("INSERT INTO SBT_Sessions(username,userIp,token,port,timeStamp) VALUES(?,?,?,?,?);"
                            , [session.username, session.userIp, session.token, session.port, session.timeStamp]);
                    makeDbCall(query);
                }

            });*/

};

UserSession.prototype.ReadFromSessionsforCometsCredentials = function (req, res, test)
{
    console.log(this.name + " >> Reading From database ReadFromSessionsforCometsCredentials ");
    Promise.using(getCredentialsSqlConnection(), function (connection) {
        return connection.query("SELECT * from SBT_Sessions").then(function (rows) {
            console.log(" >> query performed");
            test(rows, req, res);


        }).catch(function (error) {
            res.send(error);
            res.end();
            return 0;

        });
    });
};
var clearSessions = function (rows,res)
{

    UserSession.sessions = [];
    UserSession.portsListenig = [];
    for (var i = 0; i < rows.length; i++)
    {       
        UserSession.sessions.push(rows[i]);
        UserSession.portsListenig.push(UserSession.sessions[i].port);
    }
    UserSession.sessions = quickSortSessionsByIp(UserSession.sessions, 0, UserSession.sessions.length - 1);
    UserSession.portsListenig = quickSortPort(UserSession.portsListenig, 0, UserSession.portsListenig.length - 1);
    
};
UserSession.prototype.ReadFromSessions1 = function (res)
{

    status = false;
    console.log(this.name + " >> Reading From database");
    var query = "SELECT * from SBT_Sessions";
    Promise.using(getCredentialsSqlConnection(), function (connection) {
        return connection.query(query).then(function (rows) {
            console.log(" >> query performed");
             
            clearSessions(rows,res);
        }).catch(function (error) {
            console.log(error);
            res.send(error);
            res.end();


        });



    });

    console.log("emmited");

};
UserSession.prototype.ReadFromSessions = function ()
{
    status = false;
    console.log(this.name + " >> Reading From database");
    var query = "SELECT * from SBT_Sessions";
    makeDbCall(query);
    waitUntil()
            .interval(100)
            .times(10)
            .condition(function () {
                return (dbCall ? true : false);
            })
            .done(function (result) {
                UserSession.sessions = [];
                UserSession.portsListenig = [];
                for (var i = 0; i < dbRow.length; i++)
                {

                    UserSession.sessions.push(dbRow[i]);
                    UserSession.portsListenig.push(UserSession.sessions[i].port);
                }
                UserSession.sessions = quickSortSessionsByIp(UserSession.sessions, 0, UserSession.sessions.length - 1);
                UserSession.portsListenig = quickSortPort(UserSession.portsListenig, 0, UserSession.portsListenig.length - 1);
                status = true;
            });


};
UserSession.prototype.DeleteSessionFromSessions = function (session)
{
    UserSession.rows = "";
    console.log(this.name + " >> Deleting Session From DB " + session.userIp);
    var query = SqlString.format("DELETE from SBT_Sessions where userIp = ? AND username = ?", [session.userIp, session.username]);
    makeDbCall(query);
    waitUntil()
            .interval(100)
            .times(10)
            .condition(function () {
                return (dbCall ? true : false);
            })
            .done(function (result) {
                console.log(" >> SESSION  DELETED FROM DB");
                UserSession.portsListenig = removeSessionPort(session.port, UserSession.portsListenig);
                DeleteServer(session.port);
            });
    return 1;
};

UserSession.prototype.DeleteSession = function (ip)
{
    console.log(this.name + ">> DeleteSession");
    var index = this.findSessionUserIp(ip);
    this.DeleteSessionFromSessions(UserSession.sessions[index]);
    return 1;

};
/*
 * modifiers
 * @param {type} index
 * @param {type} port
 * @returns {undefined}
 */
UserSession.prototype.setSessionPortByIndex = function (index, port)
{
    console.log(this.name + " >> setSessionPortByIndex");
    UserSession.portsListenig.push(port);
    UserSession.sessions[index].port = port;
};
/*the function set the session to the system and writes to 
 * the Sessions/session.txt file 
 * 
 * @param {type} username
 * @param {type} token
 * @param {type} userIp
 * @param {type} timeStamp
 * @param {type} port
 * @returns {undefined}
 */
UserSession.prototype.SetSession1 = function (res, username, token, userIp, timeStamp, port)
{
    console.log(this.name + " >> SetSession");
    var sessionUser = {
        username: username,
        token: token,
        userIp: userIp,
        timeStamp: timeStamp,
        port: port
    };
    console.log(token);
    this.AddToSessions1(res, sessionUser);
    UserSession.sessions.push(sessionUser);
    UserSession.portsListenig.push(port);
    UserSession.sessions = quickSortSessionsByIp(UserSession.sessions, 0, UserSession.sessions.length - 1);
    UserSession.portsListenig = quickSortPort(UserSession.portsListenig, 0, UserSession.portsListenig.length - 1);
};
UserSession.prototype.SetSession = function (username, token, userIp, timeStamp, port)
{
    console.log(this.name + " >> SetSession");
    var sessionUser = {
        username: username,
        token: token,
        userIp: userIp,
        timeStamp: timeStamp,
        port: port
    };
    console.log(token);
    this.AddToSessions(sessionUser);
    UserSession.sessions.push(sessionUser);
    UserSession.portsListenig.push(port);
    UserSession.sessions = quickSortSessionsByIp(UserSession.sessions, 0, UserSession.sessions.length - 1);
    UserSession.portsListenig = quickSortPort(UserSession.portsListenig, 0, UserSession.portsListenig.length - 1);
};
/*
 * finderes
 * @param {type} userIp
 * @returns {searchUserIp.currentIndex|Number}
 */
UserSession.prototype.findSessionUserIp = function (userIp)
{
    console.log(this.name + " >> findSessionUserIp");
    UserSession.sessions = quickSortSessionsByIp(UserSession.sessions, 0, UserSession.sessions.length - 1);
    return searchUserIp(userIp, UserSession.sessions);
};
/*
 * 
 * @param {type} port
 * @returns {searchPortBusy.currentIndex|Number}
 */
UserSession.prototype.findPort = function (port)
{
    console.log(this.name + " >> findPort");
    UserSession.portsListenig = quickSortPort(UserSession.portsListenig, 0, UserSession.portsListenig.length - 1);
    console.log("ports:" + UserSession.portsListenig.length);
    for (var i = 0; i < UserSession.portsListenig.length; i++)
    {
        console.log(UserSession.portsListenig[i]);
    }
    console.log("port:" + port + ":" + searchPortBusy(port, UserSession.portsListenig));
    return searchPortBusy(port, UserSession.portsListenig);
};
/*
 * the function validate the session by checking the timestamp
 * if the time stamp is not valid it deletes the session from the file 
 * this is not a API validation 
 * @param {type} ip
 * @returns {Number}
 */
UserSession.prototype.getUserNameIndexByPort = function (port, ip)
{
    console.log(this.name + " >> getUserNameIndexByPort");
    UserSession.sessions = quickSortSessionsByPort(UserSession.sessions, 0, UserSession.sessions.length - 1);
    var index = searchSessionsByPort(port, UserSession.sessions);
    console.log("index " + index);
    console.log(UserSession.sessions[index].userIp + ":" + ip);
    if (UserSession.sessions[index].userIp === ip)
        return index;

    return -1;

};
UserSession.prototype.ValidateSessionByIp1 = function (session, ip, port)
{
    console.log(">> Session token " + session.token);
    console.log(">> Validating Session for ip " + ip);
    console.log(">> VALIDATING IP ");
    if (session.userIp !== ip)
        return -1;
    else
    {
        console.log(">> IP VALIDATED");
        console.log(">> VALIDATING PORT ");

        if (parseInt(session.port) !== parseInt(port))
        {
            console.log(" >> PORT NOT VALIDATED ");
            return -1;
        }
        console.log(">> PORT VALIDATED");
        console.log(">> VALIDATING USERNAME " + session.username);
        /*
         * to be better coded
         if (findUserName(session.username, UserSession.sessions) === -1)
         return -1;
         */
        console.log(">> USERNAME VALIDATED");
    }
    return 1;

};
UserSession.prototype.ValidateSessionByIp = function (session, ip, port, username)
{
    console.log(">> Session token " + session.token);
    console.log(">> Validating Session for ip " + ip);
    console.log(">> VALIDATING IP ");
    if (session.userIp !== ip)
        return -1;
    else
    {
        console.log(">> IP VALIDATED");
        console.log(">> VALIDATING PORT ");

        if (parseInt(session.port) !== parseInt(port))
        {
            console.log(" >> PORT NOT VALIDATED ");
            return -1;
        }
        console.log(">> PORT VALIDATED");
        console.log(">> VALIDATING USERNAME " + session.username);
        console.log(session.username + ":" + username);
        if (session.username !== username)
        {
            console.log(">> USERNAME NOT VALIDATED");
            return -1;
        }
        console.log(">> USERNAME VALIDATED");
    }
    return 1;

};
UserSession.prototype.ReactivateSession1 = function (res, session, timeStamp)
{
    console.log(this.name + " >> ReactivateSession");
    console.log(JSON.stringify(session));
    UserSession.sessions = quickSortUserName(UserSession.sessions, 0, UserSession.sessions.length - 1);
    var index = findUserName(session.username, UserSession.sessions);
    UserSession.sessions[index].userIp = session.reqIp;
    UserSession.sessions[index].timeStamp = timeStamp;
    UserSession.sessions[index].token = session.token;
    this.UpdateSessions1(res, UserSession.sessions[index]);

};
UserSession.prototype.ReactivateSession = function (session, timeStamp)
{
    console.log(this.name + " >> ReactivateSession");
    console.log(JSON.stringify(session));
    UserSession.sessions = quickSortUserName(UserSession.sessions, 0, UserSession.sessions.length - 1);
    var index = findUserName(session.username, UserSession.sessions);
    UserSession.sessions[index].userIp = session.reqIp;
    UserSession.sessions[index].timeStamp = timeStamp;
    UserSession.sessions[index].token = session.token;
    this.UpdateSessions(UserSession.sessions[index]);
    return UserSession.sessions[index].port;

};
UserSession.prototype.findUserName = function (username)
{
    dbRow = {};
    status = false;
    console.log(this.name + " >> FIND USERNAME IN DB " + username);
    var query = SqlString.format("SELECT * from SBT_Sessions where username = ?", [username]);
    makeDbCall(query);
    waitUntil()
            .interval(100)
            .times(10)
            .condition(function () {
                return (dbCall ? true : false);
            })
            .done(function (result) {
                status = true;
            });
};
UserSession.prototype.DataBase = function (query)
{
    UserSession.rows = "";
    console.log(this.name + ">> Performing Query");
    con.connect(function (err) {
        if (err)
            throw err;
        console.log("Connected!");
        con.query(query, function (err, result) {
            if (err)
                throw err;
            UserSession.rows = result;
            console.log(">> Query performed ");
        });
    });
    return UserSession.rows;
};
/*
 * private functions
 * @param {type} username
 * @param {type} sessions
 * @returns {Number|findUserName.currentIndex}
 */
function DeleteServer(port)
{
    var child = exec("sudo pm2 delete www__" + port, function (error, stdout, stderr) {
        console.log('>> Deleting Server');

        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}
function removeSessionPort(port, sessionsPort)
{
    console.log(this.name + " >> Deleting From Session port");
    var temp = [];
    var z = -1;
    //resizing the temp_bucket
    for (var y = 0; y < sessionsPort.length; y++)
    {
        console.log(sessionsPort[y] + ":" + port);
        ++z;
        if (sessionsPort[y] === port)
        {
            console.log(" >> Port Found");
            z -= 1;
            sessionsPort[y] = "";
            continue;
        } else
        {
            temp[z] = sessionsPort[y];
        }
    }
    for (var x = 0; x < temp.length; x++)
    {
        console.log(temp[x]);
    }
    return temp;

}
function findUserName(username, sessions)
{
    'use strict';

    var minIndex = 0;
    var maxIndex = sessions.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = sessions[currentIndex].username;
        if (currentElement < username) {
            minIndex = currentIndex + 1;
        } else if (currentElement > username) {
            maxIndex = currentIndex - 1;
        } else {
            return currentIndex;
        }
    }

    return -1;
}
/*
 * 
 * @param {type} session
 * @returns {Number}
 */
function validateTimeStamp(session)
{
    if ((parseInt(session.timeStamp)) > (Math.round(new Date().getTime() / 1000)))
        return 1;
    else
        return -1;
}
/*
 * helper functions
 */
function swap(items, firstIndex, secondIndex) {
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}
/*
 * by user name
 * 
 */
function partitionUserName(items, left, right) {
    var pivot = items[Math.floor((right + left) / 2)].username,
            i = left,
            j = right;


    while (i <= j) {

        while (items[i].username < pivot) {
            i++;
        }

        while (items[j].username > pivot) {
            j--;
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}

function quickSortUserName(items, left, right) {

    var index;

    if (items.length > 1) {

        index = partitionUserName(items, left, right);

        if (left < index - 1) {
            quickSortUserName(items, left, index - 1);
        }

        if (index < right) {
            quickSortUserName(items, index, right);
        }

    }

    return items;
}
function partitionSessionsByPort(items, left, right) {

    var pivot = items[Math.floor((right + left) / 2)].port,
            i = left,
            j = right;


    while (i <= j) {

        while (items[i].port < pivot) {
            i++;
        }

        while (items[j].port > pivot) {
            j--;
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}
function quickSortSessionsByPort(items, left, right) {

    var index;

    if (items.length > 1) {

        index = partitionSessionsByPort(items, left, right);

        if (left < index - 1) {
            quickSortSessionsByPort(items, left, index - 1);
        }

        if (index < right) {
            quickSortSessionsByPort(items, index, right);
        }

    }

    return items;
}
/*
 * by ip address
 * 
 */
function partitionSessionsByIp(items, left, right) {

    var pivot = items[Math.floor((right + left) / 2)].reqIp,
            i = left,
            j = right;


    while (i <= j) {

        while (items[i].reqIp < pivot) {
            i++;
        }

        while (items[j].reqIp > pivot) {
            j--;
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}
function quickSortSessionsByIp(items, left, right) {

    var index;

    if (items.length > 1) {

        index = partitionSessionsByIp(items, left, right);

        if (left < index - 1) {
            quickSortSessionsByIp(items, left, index - 1);
        }

        if (index < right) {
            quickSortSessionsByIp(items, index, right);
        }

    }

    return items;
}
/*
 * by port
 */
function partitionPort(items, left, right) {

    var pivot = items[Math.floor((right + left) / 2)],
            i = left,
            j = right;


    while (i <= j) {

        while (items[i] < pivot) {
            i++;
        }

        while (items[j] > pivot) {
            j--;
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}
function quickSortPort(items, left, right) {

    var index;

    if (items.length > 1) {

        index = partitionPort(items, left, right);

        if (left < index - 1) {
            quickSortPort(items, left, index - 1);
        }

        if (index < right) {
            quickSortPort(items, index, right);
        }

    }

    return items;
}
function searchUserIp(userIp, sessions) {
    'use strict';

    var minIndex = 0;
    var maxIndex = sessions.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = sessions[currentIndex].userIp;
        if (currentElement < userIp) {
            minIndex = currentIndex + 1;
        } else if (currentElement > userIp) {
            maxIndex = currentIndex - 1;
        } else {
            return currentIndex;
        }
    }

    return -1;
}
function searchSessionsByPort(port, sessions) {
    'use strict';

    var minIndex = 0;
    var maxIndex = sessions.length - 1;
    var currentIndex;
    var currentElement;
    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = sessions[currentIndex].port;
        if (currentElement < port) {
            minIndex = currentIndex + 1;
        } else if (currentElement > port) {
            maxIndex = currentIndex - 1;
        } else {
            return currentIndex;
        }
    }

    return -1;
}
function searchPortBusy(port, portListening) {
    'use strict';

    var minIndex = 0;
    var maxIndex = portListening.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = portListening[currentIndex];

        if (currentElement < port) {
            minIndex = currentIndex + 1;
        } else if (currentElement > port) {
            maxIndex = currentIndex - 1;
        } else {
            return currentIndex;
        }
    }

    return -1;
}
module.exports = UserSession;
