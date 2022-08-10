import { Message, Stan } from 'node-nats-streaming';
import { Listener,Subjects, CouponHealthCheckEvent } from "first-rx-common-lib";
import { queueGroupName } from './queue-group-name';

export class HealthCheckListener extends Listener<CouponHealthCheckEvent> {
  subject: Subjects.ServicesHealthCheck = Subjects.ServicesHealthCheck;
  queueGroupName = queueGroupName;
  constructor(client:Stan){
      super(client);
      super.listen();
  }
  async onMessage(data:any, msg: Message) {
    
  }
  
}