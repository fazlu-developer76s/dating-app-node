import { Request, Response } from 'express';

import { errorResponse, successResponse } from '../../utils/responses';
import mongoose from 'mongoose';
import blockModel from '../../models/blockModel';

export const blockUser = async (req: Request, res: Response): Promise<void> => {
    const { reciverUserId } = req.body;
    let payload = req.body;
    const userId = req.authUser.id;
    payload.userId = userId
    const exit = await blockModel.findOne({ userId, reciverUserId });
    if (exit) {
        res.status(403).json(errorResponse('OK', null, 'user already exit'));
        return
    }

    if (reciverUserId) {

    }
    const following = new blockModel(payload);
    await following.save();

    res.status(200).json(errorResponse('OK', null, 'user add successfully'));
    return
};

export const unblockUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.query.id;
        const userId = req.authUser.id;
        const payload = req.body;
        if (payload.status === 'unblock') {
            const following = await blockModel.findOneAndDelete({ userId: userId, _id: id });
            if (following) {
                res.status(200).json(successResponse('OK', null, 'user remove successfully'));
                return
            } else {
                res.status(404).json(errorResponse('OK', null, 'not found'));
                return
            }
        }


    } catch (error) {
        res.status(500).json(errorResponse('NOK', error, 'Error sending follow request.'));
        return
    }
};

export const listblock = async (req: Request, res: Response): Promise<void> => {
    const userId = req.authUser.id
    try {
        const { filter, page = 1, limit = 10 } = req.query;

        let query = { userId: new mongoose.Types.ObjectId(userId as string), status: "block" }
        const skip = ((page as number) - 1) * (limit as number);

        let users = await blockModel.find(query).select('reciverUserId').skip(skip).limit(limit as number).populate('reciverUserId', '_id name profilePic media').lean()

        const totalCount = await blockModel.countDocuments(query);
        let records = {
            pageNumber: page as number,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / (limit as number)),
            data: users
        };
        res.status(200).json(successResponse('OK', records, 'Follow request sent.'));
        return
    } catch (error) {
        res.status(500).json(errorResponse('NOK', error, 'Error sending follow request.'));
        return
    }
};

export const matchList = async (req: Request, res: Response): Promise<void> => {
    const userId = req.authUser.id
    try {
        const { filter, page = 1, limit = 10 } = req.query;

        let query = { userId: new mongoose.Types.ObjectId(userId as string), status: "match" }
        const skip = ((page as number) - 1) * (limit as number);

        let users = await blockModel.find(query).select('reciverUserId').skip(skip).limit(limit as number).populate('reciverUserId', '_id name profilePic media').lean()

        const totalCount = await blockModel.countDocuments(query);
        let records = {
            pageNumber: page as number,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / (limit as number)),
            data: users
        };
        res.status(200).json(successResponse('OK', records, 'get list'));
        return
    } catch (error) {
        res.status(500).json(errorResponse('NOK', error, 'something want wrong'));
        return
    }
};




