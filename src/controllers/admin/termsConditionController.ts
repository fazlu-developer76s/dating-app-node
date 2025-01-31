import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/responses';
import termsConditionModel from '../../models/termsConditionModel';

export const createTermsCondition = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        const exit = await termsConditionModel.findOneAndUpdate({ status: true }, { $set: { status: false } });

        let data = new termsConditionModel(payload);

        await data.save();
        res.status(201).json(successResponse('OK', null, 'Service successfully creaeted'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listTermsCondition = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await termsConditionModel.find()
        res.status(200).json(successResponse('OK', record, 'Service package fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const getTermsCondition = async (req: Request, res: Response): Promise<void> => {
    try {
        const servicePackageId = req.params.id
        const record = await termsConditionModel.find({ _id: servicePackageId });
        res.status(201).json(successResponse('OK', record, 'Fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const updateTermsCondition = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = req.body;
        const id = req.params.id;
        if (payload.status) {
            await termsConditionModel.findOneAndUpdate({ status: true }, { $set: { status: false } })
        }

        await termsConditionModel.findOneAndUpdate({ _id: id }, { $set: payload });
        res.status(200).json(successResponse('OK', "", 'Service package updated successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

