
var fs = require('fs');
var exec = require('child_process').exec;
var waitUntil = require('wait-until');
var UserSession = function ()
{
    this.sessions = [];
    this.portsListenig = [];
    this.name = "UserSession";
    if (!fs.existsSync("/home/gonzales1609/IRENA/Sessions/session.txt"))
        fs.open('/home/gonzales1609/IRENA/Sessions/session.txt', 'w', function (err, fd) {
            if (err) {
                throw 'could not open file: ' + err;
            }});


    this.ReadFromFile();
    console.log("instantitating " + this.name);
};

/*
 * Accesors
 * @param {type} index
 * @returns {tempSessions|Array}
 */
UserSession.prototype.getSessionByIndex = function (index)
{
    return this.sessions[index];
};
UserSession.prototype.getUserSessions = function ()
{
    return this.sessions;
};
/*
 * file operations
 * @param {type} session
 * @param {type} ip
 * @returns {undefined}
 */
UserSession.prototype.AppendToFile = function (session, ip)
{
    console.log(this.name + ">> Appending Session to File " + ip);
    setImmediate(() => {
        fs.appendFileSync("/home/gonzales1609/IRENA/Sessions/session.txt",
                session + "&&");
    });

};
UserSession.prototype.ReadFromFile = function ()
{
    this.sessions =[];
    this.portsListenig = [];
    console.log(this.name + " >> Reading Session File");
    var data = fs.readFileSync('/home/gonzales1609/IRENA/Sessions/session.txt').toString();
    var userSessions = data.split("&&");
    for (var i = 0; i < userSessions.length; i++)
    {
        if (userSessions[i] === "" || userSessions[i] === "\n")
            continue;
        this.sessions.push(JSON.parse(userSessions[i]));
        this.portsListenig.push(this.sessions[i].port);

    }
    console.log("out loop");
    this.sessions = quickSortSessionsByIp(this.sessions, 0, this.sessions.length - 1);
    this.portsListenig = quickSortPort(this.portsListenig, 0, this.portsListenig.length - 1);
    console.log("finished");
};
UserSession.prototype.DeleteSessionFromFile = function (session)
{
    console.log(this.name + " >> Deleting Session From File " + session.userIp);
    var userIp = session.userIp;
    this.sessions = [];
    this.portsListenig = [];
    this.ReadFromFile();
    var tempSessions = [];
    var sessionString = "";
    var y = -1;
    for (var i = 0; i < this.sessions.length; i++)
    {
        ++y;
        if (this.session.userIp === userIp)
        {
            --y;
            continue;
        } else
        {
            sessionString += JSON.stringify(this.sessions[y]) + "&&";
            tempSessions[i] = this.sessions[y];
        }

    }
    this.sessions = tempSessions;
    this.sessions = quickSortSessionsByIp(this.sessions, 0, this.sessions.length - 1);
    return this.WriteToFile();
};
UserSession.prototype.DeleteFromSessionBucket = function (session)
{
    console.log(this.name + " >> Deleting Session From File " + session.userIp);
    var userIp = session.userIp;
    this.sessions = [];
    this.portsListenig = [];
    var tempSessions = [];
    var sessionString = "";
    var y = -1;
    for (var i = 0; i < this.sessions.length; i++)
    {
        ++y;
        if (this.session.userIp === userIp)
        {
            --y;
            continue;
        } else
        {
            sessionString += JSON.stringify(this.sessions[y]) + "&&";
            tempSessions[i] = this.sessions[y];
        }

    }
    this.sessions = tempSessions;
    this.sessions = quickSortSessionsByIp(this.sessions, 0, this.sessions.length - 1);
};
UserSession.prototype.WriteToFile = function ()
{
    console.log(this.name + " >> Writting To Session File");
    var sessionString = "";
    for (var i = 0; i < this.sessions.length; i++)
    {
        sessionString += JSON.stringify(this.sessions[i]) + "&&";
    }

    setImmediate(() => {
        var buffer = new Buffer(sessionString);

        fs.open('/home/gonzales1609/IRENA/Sessions/session.txt', 'w', function (err, fd) {
            if (err) {
                throw 'could not open file: ' + err;
            }

            // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
            fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                if (err)
                    throw 'error writing file: ' + err;
                fs.close(fd, function () {
                    console.log('wrote the file successfully');
                });
            });
        });
    });


    return 1;
};
UserSession.prototype.DeleteSession = function (ip)
{
    console.log(this.name + ">> DeleteSession");
    var index = this.findSessionUserIp(ip);
    DeleteServer(this.sessions[index].port);
    this.DeleteSessionFromFile(this.sessions[index]);
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
    this.portsListenig.push(port);
    this.sessions[index].port = port;
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
    var stringSessionUser = JSON.stringify(sessionUser);
    this.AppendToFile(stringSessionUser, userIp);
    this.sessions.push(sessionUser);
    this.portsListenig.push(port);
    this.sessions = quickSortSessionsByIp(this.sessions, 0, this.sessions.length - 1);
    this.portsListenig = quickSortPort(this.portsListenig, 0, this.portsListenig.length - 1);
};
/*
 * finderes
 * @param {type} userIp
 * @returns {searchUserIp.currentIndex|Number}
 */
UserSession.prototype.findSessionUserIp = function (userIp)
{
    console.log(this.name + " >> findSessionUserIp");
    this.sessions = quickSortSessionsByIp(this.sessions, 0, this.sessions.length - 1);
    return searchUserIp(userIp, this.sessions);
};
/*
 *
 * @param {type} port
 * @returns {searchPortBusy.currentIndex|Number}
 */
UserSession.prototype.findPort = function (port)
{
    console.log(this.name + " >> findPort");
    this.portsListenig = quickSortPort(this.portsListenig, 0, this.portsListenig.length - 1);
    console.log("ports:" + this.portsListenig.length);
    console.log("port:" + port + ":" + searchPortBusy(port, this.portsListenig));
    return searchPortBusy(port, this.portsListenig);
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
    this.sessions = quickSortSessionsByPort(this.sessions, 0, this.sessions.length - 1);
    var index = searchSessionsByPort(port, this.sessions);
    //console.log("index "+ index +" My IP"+ip +" userIp"+this.sessions[index].userIp);
    if ( index !== -1 )
    {
       console.log(this.name + ">> FOUND");
       return index;
    }
    console.log(this.name + ">> NOT FOUND");
    return -1;

};
UserSession.prototype.ValidateSessionByIp = function (session, ip, port)
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
        if (session.port !== port)
        {
            return -1;
        }
        console.log(">> PORT VALIDATED");
        console.log(">> VALIDATING TIMESTAMP ");
        if (validateTimeStamp(session) === -1)
        {
            if (this.DeleteSessionFromFile(session) === -1)
            {
                DeleteServer(session.port);
                return -1; // to be coded
            }
        }
        console.log(">> TIMESTAMP VALIDATED");
        console.log(">> VALIDATING USERNAME "+session.username);
        if (findUserName(session.username, this.sessions) === -1)
            return -1;
        console.log(">> USERNAME VALIDATED");
    }
    return 1;

};
UserSession.prototype.ReactivateSession = function (session, timeStamp)
{
    console.log(this.name + " >> ReactivateSession");
    this.sessions = [];
    this.portsListenig = [];
    this.ReadFromFile();
    var index = this.findUserName(session.username);
    console.log(session.token);
    for(var i = 0; i < this.sessions.length; i++)
    {
        console.log(JSON.stringify(this.sessions[i]));
    }
    console.log("This is userIp" + this.sessions[index].userIp);  
    this.sessions[index].userIp = session.reqIp;
    this.sessions[index].timeStamp = timeStamp;
    this.sessions[index].token = session.token;
    this.WriteToFile();
    return this.sessions[index].port;

};
UserSession.prototype.findUserName = function (username)
{
    console.log(this.name + " >> findUserName");
    this.sessions = quickSortUserName(this.sessions, 0, this.sessions.length - 1);
    return findUserName(username, this.sessions);
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
