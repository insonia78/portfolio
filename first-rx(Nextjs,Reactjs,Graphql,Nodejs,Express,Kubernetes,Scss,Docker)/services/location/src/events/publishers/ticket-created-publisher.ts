import { Subjects , Publisher, PrescriptionCreatedEvent } from "first-rx-common-lib";



export class PrescriptionCreatedPublisher extends Publisher<PrescriptionCreatedEvent> {
  subject: Subjects.PrescriptionCreated = Subjects.PrescriptionCreated;
}
