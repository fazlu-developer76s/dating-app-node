import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/responses';
import ServicePackageModel from '../../models/servicePackageModel';

export const servicePackage = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        const exit = await ServicePackageModel.findOne({ name: payload.name });
        if (exit) {
            res.status(400).json(errorResponse('NOK', null, 'Service package already exit'));
            return
        }

        let data = new ServicePackageModel(payload);
        await data.save();
        res.status(201).json(successResponse('OK', null, 'Service package successfully creaeted'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const servicePackageList = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await ServicePackageModel.find();
        res.status(200).json(successResponse('OK', record, 'Service package fetch successfully'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const deleteservicePackage = async (req: Request, res: Response): Promise<void> => {
    try {
        const servicePackageId = req.params.id
        const record = await ServicePackageModel.findOneAndDelete({ _id: servicePackageId });
        res.status(200).json(successResponse('OK', null, 'delete record successfully'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const updateservicePackage = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = req.body;
        const servicePackageId = req.params.id;

        const existingPackage = await ServicePackageModel.findOne({ name: payload.name, _id: { $ne: servicePackageId } });

        if (existingPackage) {
            res.status(400).json(errorResponse('NOK', '', 'Service package with the same name already exists'));
            return;
        }

        const updatedPackage = await ServicePackageModel.findOneAndUpdate(
            { _id: servicePackageId },
            { $set: payload },
            { new: true }
        );

        if (!updatedPackage) {
            res.status(404).json(errorResponse('NOK', '', 'Service package not found'));
            return;
        }
        res.status(200).json(successResponse('OK', '', 'Service package updated successfully'));
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
    }
};
