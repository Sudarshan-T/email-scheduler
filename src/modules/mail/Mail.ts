import { EMAIL, EMAIL_STATUS, TO_MAIL_ID } from "../shared/constants";
import { MailModel } from "./MailModel";
import { MailSchema } from "./MailSchema";

const nodemailer = require("nodemailer");

export class Mail {
  send() {
    return new Promise(async (resolve, reject) => {
      try {
        const senderMail = process.env.SENDER_MAIL;
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: senderMail,
            pass: process.env.SENDER_PASS
          },
        });
        // send mail with defined transport object
        await transporter.sendMail({
          from: senderMail,
          to: TO_MAIL_ID,         // list of receivers
          subject: EMAIL.SUBJECT, // Subject line
          text: EMAIL.CONTENT,    // plain text body
        });
        return resolve('Email sent successfully');
      } catch (err) {
        const mailModel: MailModel = {
          toMailID: TO_MAIL_ID,
          status: EMAIL_STATUS.FAILED,
          subject: EMAIL.SUBJECT,
          content: EMAIL.CONTENT
        };
        const mailSaveObj = new MailSchema(mailModel);
        try {
          await mailSaveObj.save()
          return reject('Error on sending email');
        } catch (err) {
          return reject('Error on sending email');
        }
      }
    });
  }

  list() {
    return new Promise(async (resolve, reject) => {
      try {
        const findOf = { status: EMAIL_STATUS.FAILED };
        const data = await MailSchema.find(findOf);
        return resolve(data);
      } catch (err) {
        return reject('Error on getting failed email list');
      }
    });
  }
}
