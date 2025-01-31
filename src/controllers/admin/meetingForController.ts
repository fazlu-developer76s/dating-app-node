import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/responses';
import MeetingForModel from '../../models/meetingForModel';

export const createMeetingFor = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        const exit = await MeetingForModel.findOne({ name: payload.name });
        if (exit) {
            res.status(400).json(errorResponse('NOK', null, 'Service already exit'));
            return
        }

        let data = new MeetingForModel(payload);
        await data.save();
        res.status(201).json(successResponse('OK', null, 'Service successfully creaeted'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listMeetingFor = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await MeetingForModel.find();
        res.status(200).json(successResponse('OK', record, 'Fetch successfully'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const deleteMeetingFor = async (req: Request, res: Response): Promise<void> => {
    try {
        const servicePackageId = req.params.id
        const record = await MeetingForModel.findOneAndDelete({ _id: servicePackageId });
        res.status(200).json(successResponse('OK', null, 'delete successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const updateMeetingFor = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = req.body;
        const id = req.params.id
        const exitRec = await MeetingForModel.findOne({ name: payload.name, _id: { $ne: id } });
        if (exitRec) {
            res.status(400).json(errorResponse('NOK', "", 'Service package already exit'));
            return
        }
        await MeetingForModel.findOneAndUpdate({ _id: id }, { $set: payload });
        res.status(200).json(successResponse('OK', "", 'Service package updated successfully'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

