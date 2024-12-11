import { createTransport } from 'nodemailer';

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
    },
});

export default transporter