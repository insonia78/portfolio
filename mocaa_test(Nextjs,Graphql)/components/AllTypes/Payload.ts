import { objectType } from "@nexus/schema";
import  Employee  from "./Employee";
const Payload = objectType({
    name: "Payload",    
    definition(t) {
        t.int('code');
        t.list.field('message',{
            type:Employee,
            resolve(payload){
                return payload.message;
            }
        });
        
    }
});
export default Payload;