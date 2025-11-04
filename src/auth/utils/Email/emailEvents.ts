import { EventEmitter } from 'node:events';
import Mail from 'nodemailer/lib/mailer';
import { sendEmail } from '../Email/sendEmail';
import { template } from './generateHtml';

export enum EmailSubjectEnum {
  confirmEmail = 'Confirm Email',
  resetPassword = 'Reset Password',
}

export const emailEvent = new EventEmitter();

interface IEmail extends Mail.Options {
  otp: string;
  username: string;
}

emailEvent.on('confirmEmail', async (data: IEmail) => {
  try {
    data.subject = EmailSubjectEnum.confirmEmail;
    data.html = template({
      code: data.otp,
      name: data.username,
      subject: data.subject,
    });

    await sendEmail(data);
    console.log('✅ Confirmation email sent to:', data.to);
  } catch (error) {
    console.error('❌ Failed to send Email:', error);
  }
});
