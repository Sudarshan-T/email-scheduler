import { Schema, model } from 'mongoose';

const stringFieldRequired = { type: String, required: true };

const mailSchema = new Schema({
  toMailID: stringFieldRequired,
  status: stringFieldRequired,
  subject: stringFieldRequired,
  content: stringFieldRequired,
}, { timestamps: true })

export const MailSchema = model('Mail', mailSchema);
