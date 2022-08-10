import {  UserClass } from './models/UserClass/userClass';
import { HelperClass } from './Class/HelperClass/helperClass';
import { HttpResponseCode } from './enums/http.enums';
import { User } from './interfaces/user.interface';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const url = require('url');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());



const userClass = new UserClass(); 
userClass.initData();

//GET
app.get('/', (req:any, res:any) => {

    HelperClass.LoggerInfo(req.method + ":"+ req.originalUrl);
    res.status(HttpResponseCode.OK).send('GET - /getAllUsers -> gets all users\n' +
             'POST - /createUser -> create new users' +
             'PUT -  /updateUsers/:user -> updateUsers' +
             'DELETE - /deleteUser/:user - > deleteUser');
             HelperClass.LoggerInfo(req.method + ":"+ req.originalUrl +":"+HttpResponseCode.OK);

});

//GET /getAllUsers
app.get('/users',(req:any, res:any) => {
     HelperClass.LoggerInfo(req.method + ":"+ req.originalUrl);
     let query =  url.parse(req.url,true).query;
     let error:boolean = false;
     if((query.sortBy !== 'email' && query.sortBy !== 'name') && !(query.sortBy === undefined))
     {    
        error = true;
     }  
     else if((query.sortDirection !== 'ascending' && query.sortDirection !== 'descending') && !(query.sortDirection === undefined))
     {        
        error = true;
     }
     else if((query.sortDirection === "" || query.sortDirection === "") && !(query.sortDirection === undefined))
     {
         error = true;
     }
     else if((query.page === "" || query.limit === "") && (!(query.limit === undefined) && !(query.page === undefined)))
     {         
        error = true;
     }
     else if(!Number.isInteger(parseInt(query.page)) && !Number.isInteger(parseInt(query.limit)) && (!(query.limit === undefined) && !(query.page === undefined)))
     {         
        error = true;
     }
     if(error)
     {
        res.status(HttpResponseCode.BAD_REQUEST).send("Bad Format");
        HelperClass.LoggerError("line 56 " + req.method + ":"+ req.originalUrl +":"+HttpResponseCode.BAD_REQUEST);
        return;
     }

     let allUsers = [];
     if(!(query.sortBy === undefined) && !(query.sortDirection === undefined ))
          allUsers = userClass.getAllUsers(query.sortBy,query.sortDirection);     
     else if(!(query.sortBy === undefined))
          allUsers = userClass.getAllUsers(query.sortBy);     
     else
          allUsers = userClass.getAllUsers(); 

    if(HelperClass.isEmpty(allUsers))
    {
        res.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send("Server Error");
        HelperClass.LoggerError("line 71" + req.method + ":"+ req.originalUrl +":"+HttpResponseCode.INTERNAL_SERVER_ERROR);
        return;
    }

    if(!(query.page === undefined) && !(query.limit === undefined ))
    {
        if ( query.limit < 1 || query.page < 0){}
        else
        {
            const page:number = parseInt(query.page);
            const limit:number = parseInt(query.limit);
            const basePage:number = page  * limit;
            
            allUsers = allUsers.slice(basePage, basePage + limit);
            
        }
    }
    res.status(HttpResponseCode.OK).send(allUsers);
    HelperClass.LoggerInfo(req.method + ":"+ req.originalUrl +":"+HttpResponseCode.OK);

});

//POST
app.post('/user',(req:any,res:any) => {
    HelperClass.LoggerInfo(req.method + ":"+ req.originalUrl);
    try
    { 
        if(!HelperClass.validateEmail(req.body.email))
         {
             res.status(HttpResponseCode.BAD_REQUEST).send("Email Formated Wrong");
             HelperClass.LoggerError(req.method + ":"+ req.originalUrl +":"+HttpResponseCode.BAD_REQUEST);
             return;
         }
         let users:User[] =  userClass.getAllUsers("email");
         let index:number = users.findIndex(( e:User ) => e.email === req.body.email);

         if(index !== -1 || req.body.name === "" )
        {
            res.status(HttpResponseCode.BAD_REQUEST).send("Data non valid");
            HelperClass.LoggerError("line 110"+req.method + ":"+ req.originalUrl +":"+ HttpResponseCode.BAD_REQUEST + ":" + "data not valid");
            return;
        }
        userClass.createUser(req.body);
    }catch(e)
    {
        res.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send(e);
        HelperClass.LoggerError(req.method + ":"+ req.originalUrl +":"+HttpResponseCode.INTERNAL_SERVER_ERROR +":"+ e);

    }
    res.status(HttpResponseCode.OK).send("User Created");
    HelperClass.LoggerInfo(req.method + ":"+ req.originalUrl +":"+HttpResponseCode.OK);

});
//PUT
app.put('/user/:email',(req:any,res:any) => {
    HelperClass.LoggerInfo(req.method + ":"+ req.originalUrl);

    try
    {
        if(!HelperClass.validateEmail(req.params.email))
        {
            res.status(HttpResponseCode.BAD_REQUEST).send("Email Formated Wrong");
            HelperClass.LoggerError(req.method + ":"+ req.originalUrl +":"+HttpResponseCode.BAD_REQUEST);
            return;
        }
        let users:User[] =  userClass.getAllUsers("email");
        let index:number = users.findIndex(( e:User ) => e.email === req.params.email);
    
        if(index === -1 || req.body.email === "" || req.body.name === "" )
        {
            res.status(HttpResponseCode.BAD_REQUEST).send("Bad Request");
            HelperClass.LoggerError("line 142"+req.method + ":"+ req.originalUrl +":"+HttpResponseCode.BAD_REQUEST);
            return;
        } 
        userClass.updateUser(req.body,index);
    }catch(e)
    {
        res.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send(e);
        HelperClass.LoggerError(req.method + ":"+ req.originalUrl +":"+ HttpResponseCode.BAD_REQUEST +":"+ e);
    }
    res.status(HttpResponseCode.OK).send("User Updated");
    HelperClass.LoggerInfo(req.method + ":"+ req.originalUrl +":"+HttpResponseCode.OK);

});
//DELETE
app.delete('/user/:email',(req:any,res:any) => {
    HelperClass.LoggerInfo(req.method + ":"+ req.originalUrl);

    try
    {
        if(!HelperClass.validateEmail(req.params.email))
        {
            res.status(HttpResponseCode.BAD_REQUEST).send("Email Formated Wrong");
            HelperClass.LoggerError(req.method + ":"+ req.originalUrl +":"+HttpResponseCode.BAD_REQUEST);
            return;
        }
        let users:User[] =  userClass.getAllUsers("email");
        let index:number = users.findIndex(( e:User ) => e.email === req.params.email)
        if(index === -1 || req.body.email === "" || req.body.name === "" )
        {
            res.status(HttpResponseCode.BAD_REQUEST).send("Bad Request");
            HelperClass.LoggerError("line 172 "+req.method + ":"+ req.originalUrl +":"+HttpResponseCode.BAD_REQUEST);
            return;
        } 
        userClass.deleteUser(index);
    }catch(e)
    {
        res.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send(e);
        HelperClass.LoggerError("line 179" + req.method + ":"+ req.originalUrl +":"+ HttpResponseCode.BAD_REQUEST +":"+ e);
    }
    res.status(HttpResponseCode.OK).send("Delete Updated");
    HelperClass.LoggerInfo(req.method + ":"+ req.originalUrl +":"+HttpResponseCode.OK);

});
module.exports = app;