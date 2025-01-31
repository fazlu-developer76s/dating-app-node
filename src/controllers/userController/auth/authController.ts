import { Request, Response } from 'express';
import User from '../../../models/userModel';
import { errorResponse, successResponse } from '../../../utils/responses';
import { generateRefressToken, generateToken, verifyToken } from '../../../utils/generateToken';
import bcrypt from 'bcryptjs';
import { generateOTP } from '../../../services/otpService';
import RegisterOtpModel from '../../../models/registerOtpModel';
import { sendEmail } from '../../../services/emailService';
import { sendSMS, userOTP } from '../../../services/smsService';


export const generateOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        let exitRecord
        if (payload.type === 'email') {
            exitRecord = await User.findOne({ email: payload.email });
        }
        if (payload.type === 'phoneNumber') {
            exitRecord = await User.findOne({ phoneNumber: payload.phoneNumber });
        }

        if (exitRecord) {
            res.status(409).json(errorResponse('NOK', 'error', 'User already registered'));
            return
        }

        const otp = generateOTP();
        payload.otp = otp
        let data = new RegisterOtpModel(payload);
        let saved = await data.save();

        if (saved) {
            console.log('&&&&&& saved');

            if (payload.email === 'email') {
                await sendEmail(payload.email, otp);
            }
            if (payload.phoneNumber === 'phoneNumber') {
                await sendSMS(payload.phoneNumber, otp);
            }
            res.status(200).json(successResponse('OK', otp, 'Otp generate successfully!'));
            return
        }

        res.status(400).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const verifiedOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        let exitRecord
        if (payload.type === 'email') {
            exitRecord = await RegisterOtpModel.findOne({ email: payload.email, otp: payload.otp });
        }
        if (payload.type === 'phoneNumber') {
            exitRecord = await RegisterOtpModel.findOne({ phoneNumber: payload.phoneNumber, otp: payload.otp });
        }

        if (exitRecord) {
            await RegisterOtpModel.deleteOne({ _id: exitRecord._id })
            res.status(200).json(successResponse('OK', null, `${payload.type} is verify with otp`));
            return
        }

        res.status(400).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        console.log(req.body);

        const exitRecord = await User.findOne({ email: payload.email, phoneNumber: payload.phoneNumber });
        if (exitRecord) {
            res.status(409).json(errorResponse('NOK', 'error', 'User already registered'));
            return
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(payload.password, salt);
        payload.password = hashedPassword;
        payload.provider = 'local'
        let data = new User(payload);
        let saved = await data.save();

        if (saved) {
            let tokenData = {
                id: saved.id,
                role: saved.role,
            };
            const getToken = generateToken(JSON.stringify(tokenData));
            const refreshToken = generateRefressToken(JSON.stringify(tokenData));
            saved.refreshToken = refreshToken;
            await saved.save();
            res.status(200).json(successResponse('OK', saved, 'Register successfully!', getToken));
            return
        }

        res.status(400).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = req.body;

        if ((payload.phoneNumber) && !payload.otp) {
            const phoneNumber = payload.phoneNumber
            const exit = await RegisterOtpModel.findOne({ phoneNumber: phoneNumber })
            const otp = "123456"  //generateOTP();
            const messageBody = `Your OTP is ${otp}`;
            if (exit) {
                await RegisterOtpModel.findOneAndUpdate({ phoneNumber: phoneNumber }, { $set: { otp: otp } });
                // await userOTP(phoneNumber, otp);
                res.status(200).json(successResponse('OK', null, 'OTP sent successfully'));
                return
            }
            let payloadRecord = {
                phoneNumber: phoneNumber,
                otp: otp,
                type: 'login'
            }
            let data = new RegisterOtpModel(payloadRecord);
            let saved = await data.save();
            // await userOTP(phoneNumber, otp);
            res.status(200).json(successResponse('OK', null, 'OTP sent successfully'));
            return
        }

        if ((payload.phoneNumber) && payload.otp) {

            const phoneNumber = payload.phoneNumber
            const otp = payload.otp
            const exit = await RegisterOtpModel.findOne({ phoneNumber: phoneNumber, otp: otp });

            if (!exit) {
                res.status(401).json(errorResponse('NOK', null, 'Invalid credentials.'));
                return;
            }
            // await RegisterOtpModel.deleteOne({ _id: exit._id })
            let user = await User.findOne({ phoneNumber: phoneNumber });

            if (!user) {
                user = await User.create({ phoneNumber: phoneNumber, role: 'user', step: 3 })
            }
            let tokenData = {
                id: user._id,
                role: user.role,
            };
            const refreshToken = generateRefressToken(JSON.stringify(tokenData));
            user.refreshToken = refreshToken;
            await user.save();
            const token = generateToken(JSON.stringify(tokenData))

            res.status(200).json({
                status: "OK",
                message: 'Login successful.',
                data: user,
                token,
            });
            return
        }

        if (req.headers.authorization && payload.step) {

            console.log('****', payload);
            const token = req.headers.authorization;
            let tokenVerify = verifyToken(token);
            let tokenParse = JSON.parse(tokenVerify.id);
            let stepStart = payload.step
            const userExit = await User.findOne({ _id: tokenParse.id }).exec();
            switch (stepStart) {
                case 3:
                    payload.step = 4;
                    delete payload.isSkip
                    console.log('tokenParse.id', tokenParse.id, payload);
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 4:
                    payload.step = 5;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 5:
                    payload.step = 6;
                    let privacySetting5 = {
                        ...userExit?.privacySettings,
                        hideGender: payload.hideGender,
                    }
                    let payloadBody5 = {
                        step: 6,
                        privacySettings: privacySetting5
                    }
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payloadBody5 });
                    break;

                case 6:
                    payload.step = 7;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 7:
                    payload.step = 8;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 8:
                    payload.step = 9;
                    // let privacySetting6 = {
                    //     ...userExit?.privacySettings,
                    //     hidesexualOrientation: payload.hidesexualOrientation,
                    // }
                    let payloadBody = {
                        step: 9,
                        sexualOrientation: payload.sexualOrientation,
                        // privacySettings: privacySetting6
                    }
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payloadBody });
                    break;
                case 9:
                    payload.step = 10;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 10:
                    payload.step = 11;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 11:
                    payload.step = 12;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 12:
                    payload.step = 13;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 13:
                    payload.step = 14;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 14:
                    payload.step = 15;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 15:
                    payload.step = 16;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 16:
                    payload.step = 17;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 17:
                    payload.step = 18;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 18:
                    payload.step = 19;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 19:
                    payload.step = 20;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 20:
                    payload.step = 21;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                case 21:
                    payload.step = 22;
                    await User.findOneAndUpdate({ _id: tokenParse.id }, { $set: payload });
                    break;
                default:
                    break;
            }
            const user = await User.findOne({ _id: tokenParse.id });

            res.status(200).json(successResponse('OK', user, 'update user profile successfully'));
            return
        } else {
            console.log('&*&*&', payload.step);

            res.status(500).json(errorResponse('NOK', null, 'Token required'));
        }

    } catch (error) {
        console.log('****', error);

        res.status(500).json(errorResponse('NOK', error, 'something error'));
    }
};

export const logins = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phoneNumber } = req.body;

        const exit = await RegisterOtpModel.findOne({ phoneNumber: phoneNumber })
        const otp = generateOTP();
        const messageBody = `Your OTP is ${otp}`;
        if (exit) {
            await RegisterOtpModel.findOneAndUpdate({ phoneNumber: phoneNumber }, { $set: { otp: otp } });
            await sendSMS(phoneNumber, messageBody);
            res.status(200).send({ message: 'OTP sent successfully' });
            return
        }
        let payload = {
            phoneNumber: phoneNumber,
            otp: otp,
            type: 'login'
        }
        let data = new RegisterOtpModel(payload);
        let saved = await data.save();
        await sendSMS(phoneNumber, messageBody);
        res.status(200).send({ message: 'OTP sent successfully' });
        return
    } catch (error) {
        res.status(500).json({ status: "NOK", message: 'Error sending otp.', error });
    }
};

export const verifiedLoginOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phoneNumber, otp } = req.body;
        const exit = await RegisterOtpModel.findOne({ phoneNumber: phoneNumber, otp: otp });

        if (!exit) {
            res.status(401).json({ status: "NOK", message: 'Invalid credentials.' });
            return;
        }
        await RegisterOtpModel.deleteOne({ _id: exit._id })
        let user = await User.findOne({ phoneNumber: phoneNumber });

        if (!user) {
            user = await User.create({ phoneNumber: phoneNumber, role: 'user' })
        }

        let tokenData = {
            id: user._id,
            role: user.role,
        };
        const refreshToken = generateRefressToken(JSON.stringify(tokenData));
        user.refreshToken = refreshToken;
        await user.save();
        const token = generateToken(JSON.stringify(tokenData))

        res.status(200).json({
            status: "OK",
            message: 'Login successful.',
            data: user,
            token,
        });
    } catch (error) {
        res.status(500).json({ status: "NOK", message: 'Error logging in user.', error });
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(403).json({ message: 'Refresh token is required' });
        return
    }

    try {
        let tokenVerify = verifyToken(refreshToken);
        let tokenParse = JSON.parse(tokenVerify.id);
        const user = await User.findOne({ _id: tokenParse.id, refreshToken });
        if (!user) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return
        }
        let tokenData = {
            id: user._id,
            role: user.role,
        };
        const token = generateToken(JSON.stringify(tokenData))
        // Generate new access token
        const newAccessToken = generateRefressToken(token);

        // Return the new access token
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};
