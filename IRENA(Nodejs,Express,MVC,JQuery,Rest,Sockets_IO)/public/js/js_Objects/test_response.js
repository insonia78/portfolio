/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Test_Object = function()
{
    this.stringConstructor = "test".constructor;
    this.arrayConstructor = [].constructor;
    this.objectConstructor = {}.constructor;
    this.response;

}
Test_Object.prototype.Test_Response = function(object)
{
    
    if (object === null) {
        this.response = "null";
        return 0;
    }
    else if (object === undefined) {
        this.response = "undefined";
        return 1;
    }
    else if (object.constructor === this.stringConstructor) {
        this.response = "String";
        return 2;
    }
    else if (object.constructor === this.arrayConstructor) {
        this.response = "Array";
        return 3;
    }
    else if (object.constructor === this.objectConstructor) {
        this.response = "Object"; 
        return 4;
    }
    else {
        return "don't know";
    } 
};