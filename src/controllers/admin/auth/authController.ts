import { Request, Response } from 'express';
import User from '../../../models/userModel';
import { errorResponse, successResponse } from '../../../utils/responses';
import { generateToken } from '../../../utils/generateToken';
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email, role: 'admin' });

        if (!user) {
            res.status(401).json({ status: "NOK", message: 'Invalid credentials.' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ status: "NOK", message: 'Invalid credentials.' });
            return;
        }
        let tokenData = {
            id: user._id,
            role: user.role,
        };
        const token = generateToken(JSON.stringify(tokenData));

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
