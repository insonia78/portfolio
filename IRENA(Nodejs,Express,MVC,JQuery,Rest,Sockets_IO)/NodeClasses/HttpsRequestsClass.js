

var net = require('net');
var HttpsRequest = function (httpsConfOptions)
{
    this.httpsConfOptions = httpsConfOptions;
    HttpsRequest.httpsResponse = "";

};
var isClosed = false;
var hasError = false;

HttpsRequest.prototype.makeHttpsRequest1 = function (tcpCall,reqBody, res , ReactivateBackEndSession , SetBackEndInstance , ip )
{       
        HttpsRequest.httpsResponse = "";        
        hasError = false;
        console.log("- TCP >> makeHttpsRequest");
        var client = new net.Socket();
        client.setKeepAlive(true, 100000);
        client.connect(this.httpsConfOptions.port, this.httpsConfOptions.hostname, function () {
            console.log('- TCP >> Connected');
            console.log(this.write(JSON.stringify(reqBody)));
            console.log(this.bytesWritten);

        });
        client.on('data', function (data) {
            console.log(" >> getting data \n" + data);
            var obj = JSON.parse(data);
            console.log(" >> RESPONSE VALIDATED");
            
            if (obj.response === "7000:CREDENTIAL_ACCEPTED")
            {  
                              
              if (obj.active)
                 ReactivateBackEndSession(res, obj);
              else
                SetBackEndInstance(ip, res, obj);
                
            }
            else
            {            
              res.send(data);
              res.end();
            }
            delete tcpCall;
            
            // kill client after server's response

        });
        client.on('error', function (error) {
            console.log('- TCP >> Received error: ' + error);
            var err = {};
            err._error = error;
            err.response = "error";
            HttpsRequest.httpsResponse = err;
            hasError = true;
            // kill client after server's response
        });
        client.on('close', function () {
            console.log('- TCP >> Connection closed');
            isClosed = true;
            client.destroy();
        });
        console.log("- TCP >> Waiting for Data ");
        return client;
};

HttpsRequest.prototype.makeHttpsRequest = function (reqBody)
{
        HttpsRequest.httpsResponse = "";
        isClosed  = false;
        hasError = false;
        console.log("- TCP >> makeHttpsRequest");
        var client = new net.Socket();
        client.setKeepAlive(true, 100000);
        client.connect(this.httpsConfOptions.port, this.httpsConfOptions.hostname, function () {
            console.log('- TCP >> Connected');
            console.log(this.write(JSON.stringify(reqBody)));
            console.log(this.bytesWritten);

        });
        client.on('data', function (data) {
            HttpsRequest.httpsResponse += data;
            //console.log(data.toString());
            // kill client after server's response

        });
        client.on('error', function (error) {
            console.log('- TCP >> Received error: ' + error);
            var err = {};
            err._error = error;
            err.response = "error";
            HttpsRequest.httpsResponse = err;
            hasError = true;
            // kill client after server's response
        });
        client.on('close', function () {
            console.log('- TCP >> Connection closed');
            isClosed = true;
            client.destroy();
        });
        console.log("- TCP >> Waiting for Data");
        
    

    return true;
};
HttpsRequest.prototype.getHttpsResponse = function ()
{
    return HttpsRequest.httpsResponse;
};
HttpsRequest.prototype.hasError = function ()
{
    return hasError;
};
HttpsRequest.prototype.isClosed = function ()
{
    return isClosed;
};
HttpsRequest.prototype.setIsClosed = function (value)
{
    //console.log(value);
    HttpsRequest.isClosed = value;
};
module.exports = HttpsRequest;


