import { Request, Response } from 'express';
import Chat from '../models/chatModel';
import { errorResponse, successResponse } from '../utils/responses';

export const updateCallStatus = async (clientId: string, status: string) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { roomId: clientId },
      { $set: { callStatus: status } },
      { new: true }
    );
    console.log('Call status updated:', chat);
  } catch (error) {
    console.error('Error updating call status:', error);
  }
};

export const startCall = async (req: Request, res: Response) => {
  const { roomId, callType } = req.body;

  try {
    let chat = await Chat.findOne({ roomId });
    if (!chat) {
      chat = new Chat({ roomId, callType, callStatus: 'ongoing' });
      await chat.save();
    } else {
      chat.callStatus = 'ongoing';
      chat.callType = callType;
      await chat.save();
    }

    const response = successResponse('OK', chat, 'Call started');
    res.status(200).json(response);
  } catch (error) {
    const response = errorResponse('NOK', error, 'Error starting call');
    res.status(500).json(response);
  }
};

export const endCall = async (req: Request, res: Response) => {
  const { roomId } = req.body;

  try {
    const chat = await Chat.findOne({ roomId });
    if (chat) {
      chat.callStatus = 'ended';
      await chat.save();
      const response = successResponse('OK', chat, 'Call ended successfully');
      res.status(200).json(response);
    } else {
      const response = errorResponse('NOK', null, 'Room not found');
      res.status(404).json(response);
    }
  } catch (error) {
    const response = errorResponse('NOK', error, 'Error ending call');
    res.status(500).json(response);
  }
};
