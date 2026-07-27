import nodemailer from 'nodemailer';
import { envConfig } from '../../config/env.config';

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
        user: envConfig.email.user,
        pass: envConfig.email.pass,
    },
    connectionTimeout: 10000,
});

/**
 * Core utility function to send emails.
 * @param {EmailPayload} payload - The email details (to, subject, text, html, fromName, replyTo)
 * @returns {Promise<boolean>} True if sent successfully, otherwise throws an error.
 */
export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
    try {
        if (!envConfig.email.user || !envConfig.email.pass) {
            console.warn('[EmailService] EMAIL_USER or EMAIL_APP_PASSWORD not configured in environment. Email delivery skipped.');
            return false;
        }

        const senderName = payload.fromName || 'GSTU Hackathon';
        const replyToAddress = payload.replyTo ? payload.replyTo : envConfig.email.user;

        const mailOptions = {
            from: `"${senderName}" <${envConfig.email.user}>`,
            to: payload.to,
            subject: payload.subject,
            text: payload.text,
            html: payload.html,
            replyTo: replyToAddress,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Email sent successfully to ${payload.to}. Message ID: ${info.messageId}`);
        return true;
    } catch (error: any) {
        console.error('[EmailService] Error sending email:', error.message || error);
        return false;
    }
};
