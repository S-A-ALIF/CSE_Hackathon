import nodemailer from 'nodemailer';

export interface EmailPayload {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    fromName?: string;
    replyTo?: string;
}

/**
 * Configure the email transporter using nodemailer.
 * Ensure EMAIL_USER and EMAIL_APP_PASSWORD are set in your server/.env file.
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

/**
 * Core utility function to send emails.
 * @param {EmailPayload} payload - The email details (to, subject, text, html, fromName, replyTo)
 * @returns {Promise<boolean>} True if sent successfully, otherwise throws an error.
 */
export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
            console.warn('[EmailService] Email credentials not configured. Skipping email send.');
            return false;
        }

        const senderName = payload.fromName || 'GSTU Hackathon';
        const replyToAddress = payload.replyTo ? payload.replyTo : process.env.EMAIL_USER;

        const mailOptions = {
            from: `"${senderName}" <${process.env.EMAIL_USER}>`,
            to: payload.to,
            subject: payload.subject,
            text: payload.text,
            html: payload.html,
            replyTo: replyToAddress,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Email sent successfully to ${payload.to}. Message ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('[EmailService] Error sending email:', error);
        return false;
    }
};
