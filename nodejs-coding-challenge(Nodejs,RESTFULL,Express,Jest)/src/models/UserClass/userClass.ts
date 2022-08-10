import fs from 'fs';
import { User} from '../../interfaces/user.interface';
import { HelperClass } from '../../Class/HelperClass/helperClass';

export class UserClass{
    users:any; 
    user:User = {
        email:"",
        name:"",
        dateOfBirth:"",
        phoneNumber:"",
        address :{
            street:"",
            city:"",
            state:"",
            zipCode:"",
            country:""
        }

    };
    constructor(){}
    initData(){
        try
        {
             HelperClass.LoggerInfo(this.constructor.name +":"+"initData()");
             this.users =  fs.readFileSync('data/users.json');
             this.users = HelperClass.sortUserAscEmailArray(JSON.parse(this.users));
        }catch(e)
        {
            console.log(e);
            HelperClass.LoggerError("line 31 " + this.constructor.name +":"+"initData()"+ e);
        }

    }
    getAllUsers(sortBy:string = "name",sortDirestion:string = "ascending")
    {
        HelperClass.LoggerInfo(this.constructor.name +":"+`getAllUsers(${sortBy} , ${sortDirestion})`);
        if(this.users.length === 0)
        {
              HelperClass.LoggerError('line 40' + this.constructor.name +":"+`getAllUsers(${sortBy} , ${sortDirestion}) this.users.length = 0`);
              return new Array<User>();
        } 
        if(sortBy.localeCompare("email") === 0 && sortDirestion.localeCompare("ascending") === 0)
            return HelperClass.sortUserAscEmailArray(this.users);
        else if(sortBy.localeCompare("email") === 0 && sortDirestion.localeCompare("descending") === 0)
            return HelperClass.sortUserDescEmailArray(this.users);
        else if(sortBy.localeCompare("name") === 0 && sortDirestion.localeCompare("descending") === 0)
            return HelperClass.sortUserDescNameArray(this.users);
        else
            return HelperClass.sortUserAscNameArray(this.users);

    }
    createUser(user:User)
    {
        try{
            HelperClass.LoggerInfo(this.constructor.name +":"+`createUser(${user})`);
           this.users.push(user);
           this.users = this.getAllUsers('email');
           this.writeToUserFile(this.users);
        }catch(e)
        {
            HelperClass.LoggerError("line 62"+this.constructor.name +":"+`createUser(${user}) `+ e);
            console.log(e);
        }
    }
    updateUser(user:User,index:number)
    {
        try{
           HelperClass.LoggerInfo(this.constructor.name +":"+`updateUser()`);
           this.users = this.getAllUsers('email');
           this.users[index] = user;
            this.writeToUserFile(this.users);
        }catch(e){
            console.log(e);
            HelperClass.LoggerError("line 75"+this.constructor.name +":"+`updateUser() `+ e);
        }

    }
    deleteUser(index:number)
    {
        try{
           HelperClass.LoggerInfo(this.constructor.name +":"+`deleteUser()`);
           this.users = this.getAllUsers('email');
           this.users.splice(index,1);
           this.writeToUserFile(this.users);
        }catch(e){
            console.log(e);
            HelperClass.LoggerError("line 88" + this.constructor.name +":"+`deleteUser() `+ e);
        }

    }
    private writeToUserFile(users:User[])
    {
        try
        {
            HelperClass.LoggerInfo(this.constructor.name +":"+`writeToUserFile()`);
            fs.writeFile('data/users.json', JSON.stringify(this.users), (err) => {
                if (err)
                {
                    HelperClass.LoggerError("line 100 "+this.constructor.name +":"+`writeToUserFile() `+ err);
                    console.log(err);
                    throw new Error("Error can't write to file");
                }
                console.log("writing to users file");
                HelperClass.LoggerInfo(this.constructor.name +":"+`writeToUserFile() writing to users file`);
                fs.writeFile('dist/data/users.json', JSON.stringify(this.users), (err) => {
                    if (err)
                    {
                        HelperClass.LoggerError("line 109 " + this.constructor.name +":"+`writeToUserFile() `+ err);
                        console.log(err);
                        throw new Error("Error can't write to file");
                    }
                    console.log("writing to dist/users file");
                    HelperClass.LoggerInfo(this.constructor.name +":"+`writeToUserFile() writing to dist/users file`);

                });
            });
        }catch(e){
            HelperClass.LoggerError("line 119" + this.constructor.name +":"+`writeToUserFile() `+ e);
        }
    }
}
