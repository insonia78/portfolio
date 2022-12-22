export const keyGenerator = () =>{
    
    const value:string = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    const array:string[] = value.split("");
    let token = "";
    for(let i = 0; i < 10;i++)
    {
        token +=  array[Math.floor(Math.random() * (value.length - 1))] 
    }
    return token;
}