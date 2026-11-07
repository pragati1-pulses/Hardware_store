const nodemailer = require('nodemailer');
require('dotenv').config();

const sendOTPEmail = async (toEmail, otp) => {
    // 1. Check if credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("⚠️ No email credentials found. Falling back to offline mode.");
        return false;
    }

    // 2. Try to send the email
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS  
            }
        });

        const mailOptions = {
            from: `"Buildmart Hardware" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Password Reset OTP - Buildmart',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                    <h2>Password Reset Request</h2>
                    <p>You requested to reset your password. Here is your One-Time Password (OTP):</p>
                    <h1 style="color: #ef4444; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP is valid for 10 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 OTP email sent successfully to ${toEmail}`);
        return true;
        
    } catch (error) {
        // 3. If it fails (no internet), return false
        console.error("❌ Email sending failed. Likely no internet connection.");
        return false;
    }
};

module.exports = sendOTPEmail;