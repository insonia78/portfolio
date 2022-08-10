import { Subjects } from '../../enum/subjects.enum';

export interface PrescriptionCreatedEvent {
  subject: Subjects.LocationCreated;
  data: {
    latitude: string;
    longitude: string;
    postalCode: number;
    city: string;
    state:string;
  };
}