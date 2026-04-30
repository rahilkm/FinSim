const https = require('https');
const { CLIENT_URL, SMTP_EMAIL } = require('../config/env');

const BREVO_API_KEY = process.env.BREVO_API_KEY || '';

if (BREVO_API_KEY) {
    console.log('✅  Email service ready (Brevo API)');
} else {
    console.warn('⚠️  BREVO_API_KEY not set — reset emails will be logged to console only.');
}

function sendBrevoEmail(to, subject, htmlContent) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            sender: { name: 'FinSim', email: SMTP_EMAIL || 'rahilkm15@gmail.com' },
            to: [{ email: to }],
            subject,
            htmlContent,
        });

        const options = {
            hostname: 'api.brevo.com',
            path: '/v3/smtp/email',
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json',
                'content-length': Buffer.byteLength(body),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`Brevo API error ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

/**
 * Send a password reset email via Brevo API.
 * Falls back to console logging if Brevo is not configured.
 */
async function sendResetEmail(toEmail, resetToken) {
    const resetUrl = `${CLIENT_URL}/reset-password?token=${resetToken}`;

    if (BREVO_API_KEY) {
        await sendBrevoEmail(
            toEmail,
            'FinSim — Password Reset Request',
            `
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
            `
        );
        console.log(`📧  Password reset email sent to ${toEmail}`);
        console.log(`🔗  RESET LINK: ${resetUrl}`);
    } else {
        console.log('\n══════════════════════════════════════════════════');
        console.log('📧  PASSWORD RESET LINK (Brevo not configured — console fallback)');
        console.log(`    To: ${toEmail}`);
        console.log(`    ${resetUrl}`);
        console.log('    Token expires in 15 minutes.');
        console.log('══════════════════════════════════════════════════\n');
    }
}

module.exports = { sendResetEmail };
