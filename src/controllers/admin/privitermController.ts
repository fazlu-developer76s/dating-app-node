import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/responses';
import interestModel from '../../models/interestModel';
import privitermModel from '../../models/privitermModel';

export const createPriviterm = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        const exit = await privitermModel.findOne({ title: payload.title });
        if (exit) {
            res.status(400).json(errorResponse('NOK', null, 'Service already exit'));
            return
        }

        let data = new privitermModel(payload);
        await data.save();
        res.status(201).json(successResponse('OK', null, 'Service successfully creaeted'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listPriviterm = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await privitermModel.find()
        res.status(200).json(successResponse('OK', record, 'Service package fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const deletePriviterm = async (req: Request, res: Response): Promise<void> => {
    try {
        const servicePackageId = req.params.id
        const record = await privitermModel.findOneAndDelete({ _id: servicePackageId });
        res.status(200).json(successResponse('OK', null, 'Fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const updatePriviterm = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = req.body;
        const id = req.params.id
        const exitRec = await privitermModel.findOne({ title: payload.title, _id: { $ne: id } });
        if (exitRec) {
            res.status(400).json(errorResponse('NOK', "", 'Service package already exit'));
            return
        }
        await privitermModel.findOneAndUpdate({ _id: id }, { $set: payload });
        res.status(200).json(successResponse('OK', "", 'Service package updated successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

