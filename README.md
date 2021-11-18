# email-scheduler

** Environment Variables **
PORT=<PORT_NUMBER>
MONGODB_URL='<MONGODB_CONNECTION_STRING>'
SENDER_MAIL='<SENDER_EMAIL_ID>'
SENDER_PASS=<SENDER_PASSWORD>

** Enable less secure apps for sender mail to send mail **
** Set Receiver Mail ID in /src/modules/shared/constants.ts TO_MAIL_ID **

** api **
** add new scheduler **
/api/scheduler  -> POST Method
body = {
  minutes: '',           // string. Range -> 0 - 59, eg: minutes: '*' -> every minute, minutes: '*/5' -> every 5 minutes
  hours: '',             // string. Range -> 0 - 23, eg: hours: '*' -> every hour, hours: '*/5' -> every 5 hours
  dayOfMonth: '',        // string. Range -> 1 - 31, eg: dayOfMonth: '*' -> every dayOfMonth, dayOfMonth: '1' -> day 1 of every month
  month: '',             // string. Range -> 1 - 12, eg: month: '*' -> every month, month: '1' -> Jan
  dayOfWeek: '',         // string. Range -> 0 - 6,  eg: dayOfWeek: '*' -> every day, dayOfWeek: '0' -> Sunday
}

** update scheduler **
/api/scheduler  -> PUT Method
body = {
  _id: '',                 // scheduler id
  minutes: '',
  hours: '',
  dayOfMonth: '',
  month: '',
  dayOfWeek: '',
}

** get/list scheduler **
/api/scheduler  -> GET Method
** Params are optional. If no params are sent then all scheduler will be listed **
** For multiple values use comma separated value. eg: minutes: 1,2 **
params = {
  _id: '',
  minutes: '',
  hours: '',
  dayOfMonth: '',
  month: '',
  dayOfWeek: '',
}

** delete scheduler **
/api/scheduler  -> DELETE Method
body = {
  _id: [''],        // scheduler ids to delete
}

** get failed/unsent email **
/api/mail -> GET Method
params = {}
