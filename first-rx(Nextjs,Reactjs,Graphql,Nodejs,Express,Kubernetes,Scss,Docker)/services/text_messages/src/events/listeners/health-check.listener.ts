import { Message, Stan } from 'node-nats-streaming';
import { Listener,Subjects, TextMessageHealthCheckdEvent} from "first-rx-common-lib";
import { queueGroupName } from './queue-group-name';

export class HealthCheckListener extends Listener<TextMessageHealthCheckdEvent> {
  subject: Subjects.ServicesHealthCheck = Subjects.ServicesHealthCheck;
  queueGroupName = queueGroupName;
  constructor(client:Stan){
      super(client);
      super.listen();
  }
  async onMessage(data:any, msg: Message) {
    
  }
  
}