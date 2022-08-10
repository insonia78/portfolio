import { objectType } from "@nexus/schema";
import { findDangerousChanges } from "graphql";

const Dosage = objectType({
    name: "Dosage",
    definition(t) {
        t.string('dosage');
        t.string('quantity');
        t.string('type');
    }
})
export default Dosage;