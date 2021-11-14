import { Scheduler } from "../scheduler/Scheduler";
const cronJob = require('cron').CronJob;

export class CronJob {
  constructor() {
    // https://www.npmjs.com/package/cron
    const emailScheduler = new cronJob('* * * * *', () => {
      console.log('Running email scheduler cron job');
      new Scheduler().checkScheduler()
        .then((res) => console.log('CronJob run successfully'))
        .catch((err) => console.log('Error on running CronJob'));
    });
    emailScheduler.start();
  }
}
