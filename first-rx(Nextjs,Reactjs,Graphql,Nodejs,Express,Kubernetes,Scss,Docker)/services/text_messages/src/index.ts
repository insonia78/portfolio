import { randomBytes } from 'crypto';
import { app } from './app';
import { HealthCheckListener } from './events/listeners/health-check.listener';
import { natsWrapper } from './nats-wrapper';
const json_p  = require('/text_message/package.json');

const start = async () => { 
  const server_id = `_${randomBytes(8).toString('hex')}`; 
  
  // if (!process.env.NATS_URL) {
  //   throw new Error('NATS_URL must be defined');
  // }
  // if (!process.env.NATS_CLUSTER_ID) {
  //   throw new Error('NATS_CLUSTER_ID must be defined');
  // }
  //   try {
  //     await natsWrapper.connect(
  //       process.env.NATS_CLUSTER_ID,
  //       server_id,
  //       process.env.NATS_URL
  //     );
  //     natsWrapper.client.on('close', () => {
  //       console.log('NATS connection closed!');
  //       process.exit();
  //     });
  //     process.on('SIGINT', () => natsWrapper.client.close());
  //     process.on('SIGTERM', () => natsWrapper.client.close());    
  //     new HealthCheckListener(natsWrapper.client);
      
  //     } catch (err) {
  //       console.error(err);
  //     }

  app.listen(process.env.PORT, () => {
    console.log(server_id,`Listening on port ${process.env.PORT}!!!!!!!!`);    
  });
};

start();