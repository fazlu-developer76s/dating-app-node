import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/responses';
import StatusCategoriesModel from '../../models/statusCategoriesModel';

export const createStatusCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        const exit = await StatusCategoriesModel.findOne({ name: payload.name });
        if (exit) {
            res.status(400).json(errorResponse('NOK', null, 'Service already exit'));
            return
        }

        let data = new StatusCategoriesModel(payload);
        await data.save();
        res.status(201).json(successResponse('OK', null, 'Service successfully creaeted'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listStatusCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await StatusCategoriesModel.find();
        res.status(200).json(successResponse('OK', record, 'Service package fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const deleteStatusCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const servicePackageId = req.params.id
        const record = await StatusCategoriesModel.findByIdAndDelete({ _id: servicePackageId });
        res.status(201).json(successResponse('OK', record, 'Fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const updateStatusCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = req.body;
        const id = req.params.id
        const exitRec = await StatusCategoriesModel.findOne({ name: payload.name, _id: { $ne: id } });
        if (exitRec) {
            res.status(400).json(errorResponse('NOK', "", 'package with the same name already exists'));
            return
        }
        await StatusCategoriesModel.findOneAndUpdate({ _id: id }, { $set: payload });
        res.status(200).json(successResponse('OK', "", 'Service package updated successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

