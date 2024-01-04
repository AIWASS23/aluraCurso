import nodemailer from 'nodemailer';
import 'dotenv/config';

const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

const emailTransporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    }
});

export default emailTransporter;