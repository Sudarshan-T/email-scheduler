import { Schema, model } from 'mongoose';

const stringField = { type: String };
const numberField = { type: Number };

const schedulerSchema = new Schema({
  minutes: stringField,
  hours: stringField,
  dayOfMonth: stringField,
  month: stringField,
  dayOfWeek: stringField,
  scheduleMinutes: [numberField],
  scheduleHours: [numberField],
  scheduleDayOfMonth: [numberField],
  scheduleMonth: [numberField],
  scheduleDayOfWeek: [numberField],
}, { timestamps: true })

export const SchedulerSchema = model('Scheduler', schedulerSchema);
