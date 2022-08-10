import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { randomBytes } from 'crypto';
import { HealthCheckListener } from './events/listeners/health-check.listener';
const json_p = require('/coupon/package.json');

const start = async () => {

  const server_id = `${json_p.name}_${randomBytes(8).toString('hex')}`;
  // console.log('server_id',server_id);
  // if (!process.env.NATS_URL) {
  //   throw new Error('NATS_URL must be defined');
  // }
  // if (!process.env.NATS_CLUSTER_ID) {
  //   throw new Error('NATS_CLUSTER_ID must be defined');
  // }
  // try {
  //   await natsWrapper.connect(
  //     process.env.NATS_CLUSTER_ID,
  //     server_id,
  //     process.env.NATS_URL
  //   );
  //   natsWrapper.client.on('close', () => {
  //     console.log('NATS connection closed!');
  //     process.exit();
  //   });
  //   process.on('SIGINT', () => natsWrapper.client.close());
  //   process.on('SIGTERM', () => natsWrapper.client.close());
  //   new HealthCheckListener(natsWrapper.client);
  // } catch (err) {
  //   console.error(err);
  // }

  app.listen(process.env.PORT, () => {
    console.log(server_id, `Listening on port ${process.env.PORT}!!!!!!!!`);
  });
};

start();