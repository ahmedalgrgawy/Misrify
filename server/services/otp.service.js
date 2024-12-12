import { resetEmailTemplate } from "../views/resetEmailTemplate.js";
import { verifyEmailTemplate } from "../views/verifyEmailTemplate.js"
import { sendEmail } from "./nodemailer.service.js";

export const sendVerifyOtp = async (email, name, otp) => {
    try {
        const htmlTemplate = verifyEmailTemplate(otp, name);

        await sendEmail(email, "Verify Email", htmlTemplate);

    } catch (error) {
        console.log(error);
    }
}

export const sendResetOtp = async (email, name, resetOtp) => {
    try {
        const htmlTemplate = resetEmailTemplate(resetOtp, name);

        await sendEmail(email, "Reset Password", htmlTemplate);

    } catch (error) {
        console.log(error);
    }
}