import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/responses';
import userModel from '../../models/userModel';


export const getUserList = async (req: Request, res: Response): Promise<void> => {
    try {

        const { filter, page = 1, limit = 10 } = req.query;

        let query = { role: { $nin: ["admin"] } };

        if (filter) {
            query = { ...query, ...JSON.parse(filter as string) };
        }
        const skip = ((page as number) - 1) * (limit as number);

        const users = await userModel.find(query).skip(skip).limit(limit as number).populate('sexualOrientation interest stausCatogry lookingFor meetingFor')
        const totalCount = await userModel.countDocuments(query);
        let records = {
            pageNumber: page as number,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / (limit as number)),
            data: users
        };

        res.status(200).json(successResponse('OK', records, 'Fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        let userId = req.params.id
        await userModel.findByIdAndDelete({ _id: userId })

        res.status(200).json(successResponse('OK', null, 'user delete'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};



