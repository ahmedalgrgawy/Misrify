import transporter from "../lib/nodemailer.js";
import { welcomeEmailTemplate } from "../views/welcomeEmail.js";

export const sendEmail = async (email, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: subject,
            html: html
        })
    } catch (error) {
        console.log(error);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    try {
        const htmlTemplate = welcomeEmailTemplate(name);

        await sendEmail(email, "Welcome Email", htmlTemplate);

    } catch (error) {
        console.log(error);
    }
}