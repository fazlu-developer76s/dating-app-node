import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export const sendSMS = async (to: string, body: string): Promise<void> => {
    try {
        await client.messages.create({
            body,
            from: twilioPhoneNumber,
            to
        });
        console.log(`Message sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send message to ${to}:`, error);
        throw new Error('Failed to send SMS');
    }
};



import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto';

interface UserDetails {
    mobile_no: string;
}

async function userOTP(mobile: string = "", otp: string): Promise<number | null> {
    // SMS API Integration
    // let otp: number = 1234;
    const mobileNo: string = mobile;

    const entityId: string = '1701159540601889654';
    const senderId: string = 'NRSOFT';
    const tempId: string = '1707164805234023036';
    const userId: string = 'NERASOFT1';
    const password: string = '111321';

    // Generate a random 4-digit OTP
    // otp = crypto.randomInt(1000, 9999);

    const message: string = `Dear User Your OTP For Login in sixcash is ${otp} Valid For 10 Minutes. we request you to don't share with anyone. Thanks NSAFPL`;

    // Build the API URL with query parameters
    const url: string = `http://sms.nerasoft.in/api/SmsApi/SendSingleApi?UserID=${userId}&Password=${password}&SenderID=${senderId}&Phno=${mobileNo}&Msg=${encodeURIComponent(message)}&EntityID=${entityId}&TemplateID=${tempId}`;

    try {
        // Make the API request using axios
        const response: AxiosResponse = await axios.post(url);

        // Check if the API call was successful
        if (response.status === 200) {

            console.log('SMS sent successfully');
            return Number(otp);
        } else {
            console.error('Failed to send SMS:', response.statusText);
            return null;
        }
    } catch (error: any) {
        console.error('Error sending SMS:', error.message);
        return null;
    }
}

export { userOTP };
