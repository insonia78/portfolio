
#include "MessagesType.h"
QString processMessage(int value)
{
    switch(value)
    {
        case ERR_INVALID_SESSION:// 1000
            return "1000:ERR_INVALID_SESSION";
        case ERR_EXPIRED_SESSION:// 2000
            return "2000:ERR_EXPIRED_SESSION"; 
        case ERR_REQUEST_INVALID:// 3000
            return "3000:ERR_REQUEST_INVALID";
        case ERR_CREDENTIAL_INVALID: //4000
            return "4000:ERR_CREDENTIAL_INVALID";
        case ERR_REQUEST_FORMAT:// 5000
            return "5000:ERR_REQUEST_FORMAT";
	case ERR_REQUEST_SAVE: //6000
             return "6000:ERR_REQUEST_FORMAT";
        case ERR_REQUEST_CALCULATE:// 6001  
	     return "6001:ERR_REQUEST_CALCULATE"; 
	case ERR_REQUEST_DELETE:// 6002
            return "6002:ERR_REQUEST_DELETE";
        case ERR_REQUEST_QUERY://6003
            return "6003:ERR_REQUEST_QUERY";
        case CREDENTIAL_ACCEPTED: //7000
            return "7000:CREDENTIAL_ACCEPTED";
        case SUCCESS_REQUEST: //7001
            return "7001:SUCCESS_REQUEST";
        case SUCCESS_NO_PROJECTS:// 7002
            return "7002:SUCCESS_NO_PROJECTS";
        default:
            return "6004:ERR_INVALID_REQU";
    }
}