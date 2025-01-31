import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/responses';
import faqModel from '../../models/faqModel';

export const createFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        const exit = await faqModel.findOne({ question: payload.question });
        if (exit) {
            res.status(400).json(errorResponse('NOK', null, 'Service already exit'));
            return
        }

        let data = new faqModel(payload);
        await data.save();
        res.status(201).json(successResponse('OK', null, 'Service successfully creaeted'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await faqModel.find()
        res.status(200).json(successResponse('OK', record, 'faq fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const deleteFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        const servicePackageId = req.params.id
        const record = await faqModel.findByIdAndDelete({ _id: servicePackageId });
        res.status(201).json(successResponse('OK', record, 'Fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const updateFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = req.body;
        const id = req.params.id
        const exitRec = await faqModel.findOne({ question: payload.question, _id: { $ne: id } });
        if (exitRec) {
            res.status(400).json(errorResponse('NOK', "", 'faq already exit'));
            return
        }
        await faqModel.findOneAndUpdate({ _id: id }, { $set: payload });
        res.status(200).json(successResponse('OK', "", 'faq updated successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

