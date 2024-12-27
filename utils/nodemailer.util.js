const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

class NodemailerUtil {
    static async createTransporter() {
        const oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,     // Client ID
            process.env.GOOGLE_CLIENT_SECRET, // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject('Failed to create access token: ' + err);
                }
                resolve(token);
            });
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_EMAIL,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        return transporter;
    }

    static async sendPasswordResetEmail(email, resetLink) {
        try {
            // Create transporter
            const transporter = await this.createTransporter();

            const mailOptions = {
                from: process.env.GMAIL_EMAIL,
                to: email,
                subject: 'Password Reset Request',
                html: `
                    <h1>Password Reset</h1>
                    <p>You have requested to reset your password. Click the link below to reset:</p>
                    <a href="${resetLink}">Reset Password</a>
                    <p>If you did not request a password reset, please ignore this email.</p>
                `
            };

            // Send email
            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
}

module.exports = NodemailerUtil;
