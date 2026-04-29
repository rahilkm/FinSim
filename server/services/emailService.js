const nodemailer = require('nodemailer');
const { SMTP_EMAIL, SMTP_PASSWORD, CLIENT_URL } = require('../config/env');

// Check if SMTP is configured
const isSmtpConfigured =
    SMTP_EMAIL &&
    SMTP_PASSWORD &&
    SMTP_EMAIL !== 'your_gmail@gmail.com' &&
    SMTP_PASSWORD !== 'your_gmail_app_password';

// Create reusable transporter (only if configured)
let transporter = null;
if (isSmtpConfigured) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD,
        },
    });

    // Verify connection on startup
    transporter.verify()
        .then(() => console.log('✅  Email service connected (Gmail SMTP)'))
        .catch((err) => console.warn('⚠️  Email service failed to connect:', err.message));
} else {
    console.warn('⚠️  SMTP not configured — reset emails will be logged to console only.');
    console.warn('   Set SMTP_EMAIL and SMTP_PASSWORD in .env to enable email sending.');
}

/**
 * Send a password reset email.
 * Falls back to console logging if SMTP is not configured.
 */
async function sendResetEmail(toEmail, resetToken) {
    const resetUrl = `${CLIENT_URL}/reset-password?token=${resetToken}`;

    if (transporter) {
        const mailOptions = {
            from: `"FinSim" <${SMTP_EMAIL}>`,
            to: toEmail,
            subject: 'FinSim — Password Reset Request',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0a0f1c; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #0e1726 0%, #0a0f1c 100%); padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #1e293b;">
                        <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #22d3ee; letter-spacing: -0.5px;">FinSim</h1>
                        <p style="margin: 4px 0 0; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 2px;">Financial Scenario Simulator</p>
                    </div>
                    <div style="padding: 32px;">
                        <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #f1f5f9;">Password Reset</h2>
                        <p style="margin: 0 0 24px; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                            We received a request to reset the password for your FinSim account. Click the button below to set a new password.
                        </p>
                        <div style="text-align: center; margin: 28px 0;">
                            <a href="${resetUrl}" style="display: inline-block; background: #22d3ee; color: #000000; font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 12px; text-decoration: none; letter-spacing: 0.3px;">
                                Reset Password
                            </a>
                        </div>
                        <p style="margin: 24px 0 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                            This link will expire in <strong style="color: #94a3b8;">15 minutes</strong>. If you didn't request a password reset, you can safely ignore this email.
                        </p>
                        <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
                        <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.5;">
                            If the button doesn't work, copy and paste this URL into your browser:<br/>
                            <a href="${resetUrl}" style="color: #22d3ee; word-break: break-all;">${resetUrl}</a>
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧  Password reset email sent to ${toEmail}`);
    } else {
        // Fallback: log to console
        console.log('\n══════════════════════════════════════════════════');
        console.log('📧  PASSWORD RESET LINK (email not configured — console fallback)');
        console.log(`    To: ${toEmail}`);
        console.log(`    ${resetUrl}`);
        console.log('    Token expires in 15 minutes.');
        console.log('══════════════════════════════════════════════════\n');
    }
}

module.exports = { sendResetEmail };
