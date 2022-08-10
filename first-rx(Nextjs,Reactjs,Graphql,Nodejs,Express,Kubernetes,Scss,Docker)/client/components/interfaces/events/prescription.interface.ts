import { Subjects } from '../../enum/subjects.enum';

export interface PrescriptionCreatedEvent {
  subject: Subjects.PrescriptionCreated;
  data: {
    manufacture: string;
    format: string;
    dosage: number;
    quantity: string;
  };
}