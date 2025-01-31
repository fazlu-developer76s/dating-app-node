import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/responses';
import interestModel from '../../models/interestModel';
import preferenceModel from '../../models/preferenceModel';

export const createPeference = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        const exit = await preferenceModel.findOne({ name: payload.name, value: payload.value });

        if (exit) {
            res.status(400).json(errorResponse('NOK', null, 'Service already exit'));
            return
        }

        let data = new preferenceModel(payload);
        await data.save();
        res.status(201).json(successResponse('OK', null, 'Service successfully creaeted'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listPreference = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await preferenceModel.find()
        res.status(200).json(successResponse('OK', record, 'Service package fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const deletePeference = async (req: Request, res: Response): Promise<void> => {
    try {
        const servicePackageId = req.params.id
        const record = await preferenceModel.findOneAndDelete({ _id: servicePackageId });
        res.status(200).json(successResponse('OK', null, 'Fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const updatePeference = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = req.body;
        const id = req.params.id
        const exitRec = await preferenceModel.findOne({ name: payload.name, _id: { $ne: id } });
        if (exitRec) {
            res.status(400).json(errorResponse('NOK', "", 'Service package already exit'));
            return
        }
        await preferenceModel.findOneAndUpdate({ _id: id }, { $set: payload });
        res.status(200).json(successResponse('OK', "", 'Service package updated successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

