
var fs = require('fs');
module.exports = class HttpsSBTRequestType
{
    construttor()
    {

        HttpsSBTRequestType.variable =
                {
                    
                };
        this.reqCredentials =
                {
                    request: "8001:REQ_CREDENTIAL_VALIDATION",
                    username:""

                };

    }
    getReqProject()
    {
        return HttpsSBTRequestType.reqProject = {
            action: "RETRIEVE_PROJECTS"

        };

    }

};

