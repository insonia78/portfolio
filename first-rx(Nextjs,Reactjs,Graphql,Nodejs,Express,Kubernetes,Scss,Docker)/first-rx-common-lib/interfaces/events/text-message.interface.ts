import { Subjects } from '../../enum/subjects.enum';

export interface TextMessageHealthCheckdEvent {
  subject: Subjects.ServicesHealthCheck;
  data: {
   
  };
}