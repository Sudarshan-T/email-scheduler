import { SchedulerModel } from "./SchedulerModel";
import { SchedulerSchema } from "./SchedulerSchema";
import { Types } from 'mongoose'
import { Mail } from "../mail/Mail";
import { isValidCron } from 'cron-validator'

const cronConverter = require('cron-converter');
const ObjectId = Types.ObjectId

export class Scheduler {
  create(scheduleDetails) {
    return new Promise(async (resolve, reject) => {
      try {
        // scheduler to save. If any option does not exist set * as default value
        const newScheduler = new SchedulerModel();
        newScheduler.minutes = scheduleDetails.minutes ? scheduleDetails.minutes : '*';
        newScheduler.hours = scheduleDetails.hours ? scheduleDetails.hours : '*';
        newScheduler.dayOfMonth = scheduleDetails.dayOfMonth ? scheduleDetails.dayOfMonth : '*';
        newScheduler.month = scheduleDetails.month ? scheduleDetails.month : '*';
        newScheduler.dayOfWeek = scheduleDetails.dayOfWeek ? scheduleDetails.dayOfWeek : '*';
        // Validate cron options
        if (!isValidCron(
          `${newScheduler.minutes} ${newScheduler.hours} ${newScheduler.dayOfMonth} ${newScheduler.month} ${newScheduler.dayOfWeek}`
        )) {
          return reject('Invalid Request');
        }
        // get CronJob run time
        const cronInstance = new cronConverter();
        cronInstance.fromString(
          `${newScheduler.minutes} ${newScheduler.hours} ${newScheduler.dayOfMonth} ${newScheduler.month} ${newScheduler.dayOfWeek}`
        );
        newScheduler.scheduleMinutes = cronInstance.toArray()[0];
        newScheduler.scheduleHours = cronInstance.toArray()[1];
        newScheduler.scheduleDayOfMonth = cronInstance.toArray()[2];
        newScheduler.scheduleMonth = cronInstance.toArray()[3];
        newScheduler.scheduleDayOfWeek = cronInstance.toArray()[4];
        const saveObj = new SchedulerSchema(newScheduler);
        await saveObj.save();
        return resolve('Schedule saved successfully');
      } catch (err) {
        return reject('Error on saving schedule');
      }
    });
  }

  update(scheduleDetails) {
    // scheduler to update
    const updateOf = { _id: new ObjectId(scheduleDetails._id) };
    const updatable: any = {};
    return new Promise(async (resolve, reject) => {
      try {
        const cronInstance = new cronConverter();
        if (scheduleDetails.minutes) {
          // Validate minutes and set new value
          if (!isValidCron(`${scheduleDetails.minutes} * * * *`)) {
            return reject('Invalid Request');
          }
          updatable['minutes'] = scheduleDetails.minutes;
          cronInstance.fromString(`${scheduleDetails.minutes} * * * *`);
          updatable['scheduleMinutes'] = cronInstance.toArray()[0];
        }
        if (scheduleDetails.hours) {
          // Validate hours and set new value
          if (!isValidCron(`* ${scheduleDetails.hours} * * *`)) {
            return reject('Invalid Request');
          }
          updatable['hours'] = scheduleDetails.hours;
          cronInstance.fromString(`* ${scheduleDetails.hours} * * *`);
          updatable['scheduleHours'] = cronInstance.toArray()[1];
        }
        if (scheduleDetails.dayOfMonth) {
          // Validate dayOfMonth and set new value
          if (!isValidCron(`* * ${scheduleDetails.dayOfMonth} * *`)) {
            return reject('Invalid Request');
          }
          updatable['dayOfMonth'] = scheduleDetails.dayOfMonth;
          cronInstance.fromString(`* * ${scheduleDetails.dayOfMonth} * *`);
          updatable['scheduleDayOfMonth'] = cronInstance.toArray()[2];
        }
        if (scheduleDetails.month) {
          // Validate month and set new value
          if (!isValidCron(`* * * ${scheduleDetails.month} *`)) {
            return reject('Invalid Request');
          }
          updatable['month'] = scheduleDetails.month;
          cronInstance.fromString(`* * * ${scheduleDetails.month} *`);
          updatable['scheduleMonth'] = cronInstance.toArray()[3];
        }
        if (scheduleDetails.dayOfWeek) {
          // Validate dayOfWeek and set new value
          if (!isValidCron(`* * * * ${scheduleDetails.dayOfWeek}`)) {
            return reject('Invalid Request');
          }
          updatable['dayOfWeek'] = scheduleDetails.dayOfWeek;
          cronInstance.fromString(`* * * * ${scheduleDetails.dayOfWeek}`);
          updatable['scheduleDayOfWeek'] = cronInstance.toArray()[4];
        }
        // If any value exist for update then update
        if (Object.keys(updatable).length > 0) {
          await SchedulerSchema.updateOne(updateOf, updatable);
          return resolve('Schedule updated successfully');
        } else {
          return reject('Please enter values to update');
        }
      } catch (err) {
        return reject('Error on updating schedule');
      }
    });
  }

  list(query) {
    return new Promise(async (resolve, reject) => {
      try {
        const andSearch = [];
        const convertToArray = (data) => {
          if (typeof data === 'string') return data.split(',');
          return data;
        };
        const convertToObjectId = (ids) => {
          if (typeof ids === 'string') return ids.split(',').map(id => new ObjectId(id));
          return ids.map(id => new ObjectId(id));
        }
        if (query._id) {
          andSearch.push({ _id: { $in: convertToObjectId(query._id) } });
        }
        if (query.minutes) {
          andSearch.push({ minutes: { $in: convertToArray(query.minutes) } });
        }
        if (query.hours) {
          andSearch.push({ hours: { $in: convertToArray(query.hours)} });
        }
        if (query.dayOfMonth) {
          andSearch.push({ dayOfMonth: { $in: convertToArray(query.dayOfMonth) } });
        }
        if (query.month) {
          andSearch.push({ month: { $in: convertToArray(query.month) } });
        }
        if (query.dayOfWeek) {
          andSearch.push({ dayOfWeek: { $in: convertToArray(query.dayOfWeek) } });
        }
        let schedulers = [];
        const project = { minutes: 1, hours: 1, dayOfMonth: 1, month: 1, dayOfWeek: 1 };
        if (andSearch.length > 0) {
          schedulers = await SchedulerSchema.find({ $and: andSearch }, project);
        } else {
          schedulers = await SchedulerSchema.find({}, project);
        }
        return resolve(schedulers);
      } catch (err) {
        return reject('Error on getting scheduler list');
      }
    });
  }

  delete(schedulers) {
    return new Promise(async (resolve, reject) => {
      try {
        const  ids = schedulers._id;
        if (!ids || ids.length === 0) {
          return reject('Please send scheduler ID');
        }
        const deleteList = ids.map(id => new ObjectId(id));
        await SchedulerSchema.deleteMany({ _id: { $in: deleteList } });
        return resolve('Scheduler deleted successfully');
      } catch (err) {
        return reject('Error on deleting scheduler');
      }
    });
  }

  checkScheduler() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay();
    return new Promise(async (resolve, reject) => {
      try {
        const andSearch = [];
        andSearch.push({ scheduleMinutes: { $elemMatch: { $eq: minutes } } });
        andSearch.push({ scheduleHours: { $elemMatch: { $eq: hours } } });
        andSearch.push({ scheduleDayOfMonth: { $elemMatch: { $eq: dayOfMonth } } });
        andSearch.push({ scheduleMonth: { $elemMatch: { $eq: month } } });
        andSearch.push({ scheduleDayOfWeek: { $elemMatch: { $eq: dayOfWeek } } });
        const scheduler: any = await SchedulerSchema.find({ $and: andSearch });
        if (scheduler.length > 0) {
          await new Mail().send();
        }
        return resolve('Cronjob run successfully');
      } catch (err) {
        return reject('Error on getting scheduled time');
      }
    });
  }
}
