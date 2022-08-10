import { Subjects } from '../../enum/subjects.enum';

export interface PrescriptionCreatedEvent {
  subject: Subjects.CouponCreated;
  data: {
   
  };
}