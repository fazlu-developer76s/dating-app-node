import nodemailer from "nodemailer";

export const sendEmail = async (email: string, otp?: string | null, password?: string, userId?: string,): Promise<void> => {
    console.log('****');
    console.log('****');
    console.log('****');

    console.log('**** otp and email', email);

    const transporter = nodemailer.createTransport({
        host: 'mail.nerasoft.in', // Your SMTP server
        port: 587,
        secure: false,
        auth: {
            user: 'info@nerasoft.in',
            pass: 'Nera@1434',
        },
        tls: {
            rejectUnauthorized: true,
        },
    });
    let mailOptions = {
        from: 'info@nerasoft.in',
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}`,
    };

    if (email && password) {
        mailOptions = {
            from: 'info@nerasoft.in',
            to: email,
            subject: "Your Credential",
            text: `Your password is ${password}`,
        };
    }


    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send OTP via email");
    }
};

export const sendLink = async (email: string, token: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: 'mail.nerasoft.in', // Your SMTP server
        port: 587,
        secure: false,
        auth: {
            user: 'info@nerasoft.in',
            pass: 'Nera@1434',
        },
        tls: {
            rejectUnauthorized: true,
        },
    });

    let mailOptions = {
        from: 'info@nerasoft.in',
        to: email,
        subject: "Your password reset link",
        text: `Your link ${token}`,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send Link via email");
    }
};
