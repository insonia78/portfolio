import  { HelperClass }  from '../Class/HelperClass/helperClass';
import { User } from '../interfaces/user.interface';
test('Testing empty method empty string ',()=>{
    const value = HelperClass.isEmpty("");
    expect(value).toBe(true);
});

test('Testing empty method empty null',()=>{
    const value = HelperClass.isEmpty(null);
    expect(value).toBe(true);
});

test('Testing empty method empty array',()=>{
    const value = HelperClass.isEmpty([]);
    expect(value).toBe(true);
});
test('Testing sorting emails array for User asc',()=>{
    let user:User[] = [{name:"",email:"c",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}},
                       {name:"",email:"a",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}},
                       {name:"",email:"b",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}}]; 
    const value = HelperClass.sortUserAscEmailArray(user);
    expect(value).toStrictEqual([{name:"",email:"a",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}},
                        {name:"",email:"b",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}},
                        {name:"",email:"c",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}}]);
});
test('Testing sorting emails array for User desc',()=>{
    let user:User[] = [{name:"",email:"c",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}},
                       {name:"",email:"a",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}},
                       {name:"",email:"b",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}}]; 
    const value = HelperClass.sortUserDescEmailArray(user);
    expect(value).toStrictEqual([{name:"",email:"c",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}},
                        {name:"",email:"b",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}},
                        {name:"",email:"a",dateOfBirth:"",phoneNumber:"",address:{street:"",city:"",state:"",zipCode:"",country:""}}]);
});
test('Testing validate test@test.com  true email',()=>{
    const value = HelperClass.validateEmail('test@test.com');
    expect(value).toBe(true);
});
test('Testing validate email true test1@test.com email',()=>{
    const value = HelperClass.validateEmail('test1@test.com');
    expect(value).toBe(true);
});
test('Testing validate 1test1@test.com true email',()=>{
    const value = HelperClass.validateEmail('1test1@test.com');
    expect(value).toBe(true);
});
test('Testing validate test@test@ false email',()=>{
    const value = HelperClass.validateEmail('test@test@');
    expect(value).toBe(false);
});
test('Testing validate test.test.it false email',()=>{
    const value = HelperClass.validateEmail('test.test.it');
    expect(value).toBe(false);
});
