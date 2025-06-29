import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendMail(
    email: string,
    fullName: string,
    verificationCode: string,
) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Tarah - Password Reset Request | Verification Code",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Password Reset Request</h2>
                    <p>Hi ${fullName},</p>
                    <p>We received a request to reset your password. Please use the following verification code to proceed:</p>
                    <h3 style="color: #007bff;">${verificationCode}</h3>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Thank you!</p>
                </div>
            `,
        }

        const mailResponse = await transport.sendMail(mailOptions);

        if (mailResponse) {
            return {
                success: true,
                message: "Verification email send successfully",
            };
        } else {
            return {
                success: false,
                message: "Failed to send verification email",
            };
        } 
    } catch (error) {
        console.error("Error sending verification email", error);
        return {
            success: false,
            message: "An error occurred while sending the verification email",
        };
    }
}