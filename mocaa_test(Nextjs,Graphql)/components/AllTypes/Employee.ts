import { objectType } from "@nexus/schema";
const Employee = objectType({
    name: "Employee",    
    definition(t) {
        t.string('first_name');
        t.string('middle_name');
        t.string('last_name');
        t.string('age');
        t.string('email');
        t.string('title');
        t.string('id');
        t.string('start_date');
    }
});
export default Employee;