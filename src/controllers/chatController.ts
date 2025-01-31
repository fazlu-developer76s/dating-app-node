import { Request, Response } from 'express';
import Chat from '../models/chatModel';
import Message from '../models/messageModel';
import { errorResponse, successResponse } from '../utils/responses';

export const saveMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, roomId, message, type } = req.body;

  try {
    let chat = await Chat.findOne({ senderId, receiverId, roomId });
    if (!chat) {
      chat = new Chat({ senderId, receiverId, roomId, callType: type, callStatus: 'ongoing' });
      await chat.save();
    }

    const newMessage = new Message({
      roomId,
      message: [
        {
          senderId,
          receiverId,
          message,
          type,
          createAt: new Date(),
          view: '0',
        },
      ],
    });

    await newMessage.save();
    const response = successResponse('OK', newMessage, 'Message saved successfully');
    res.status(201).json(response);
  } catch (error) {
    const response = errorResponse('NOK', error, 'Error saving message');
    res.status(500).json(response);
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    const messages = await Message.find({ roomId }).populate('message.senderId message.receiverId');
    res.status(200).json(messages);
  } catch (error) {
     const response = errorResponse('NOK', error, 'Error retrieving messages');
    res.status(500).json(response);
  }
};
