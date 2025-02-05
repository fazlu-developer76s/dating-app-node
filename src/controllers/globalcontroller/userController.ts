import { Request, Response } from 'express';
import User from '../../models/userModel';
import { errorResponse, successResponse } from '../../utils/responses';
import zodiacModel from '../../models/zodiacModel';
import sexualOrientationModel from '../../models/sexualOrientationModel';
import lookingForModel from '../../models/lookingForModel';
import meetingForModel from '../../models/meetingForModel';
import statusCategoriesModel from '../../models/statusCategoriesModel';
import interestModel from '../../models/interestModel';
import privacyModel from '../../models/privacyModel';
import termsConditionModel from '../../models/termsConditionModel';
import languageModel from '../../models/languageModel';
import { Message } from 'twilio/lib/twiml/MessagingResponse';
import Chat from '../../models/chatModel';
import Message0 from '../../models/messageModel';


export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        let userId = req.params.id
        const user = await User.findOne({ _id: userId })
        if (!user) {
            res.status(404).json(errorResponse('OK', null, 'User not found'));
            return
        }
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.privacySettings.hideEmail ? '' : user.email,
            phoneNumber: user.privacySettings.hidePhoneNumber ? '' : user.phoneNumber,
            address: user.privacySettings.hideAddress ? '' : user.address,
            gender: user.privacySettings.hideGender ? '' : user.gender,
            dob: user.privacySettings.hideDob ? '' : user.dob,
            education: user.education,
            relationShip: user.relationShip,
            status: user.status,
            role: user.role,
            provider: user.provider,
            socialId: user.socialId,
        };

        res.status(200).json(successResponse('OK', userData, 'Record fetched successfully'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const getUserList = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({ role: { $nin: ["admin"] } , _id: { $nin: req.authUser.id } }).select("name media _id");
        let newusers: any[] = [];
        for (const user of users) {
          const getroom = await Chat.findOne({ receiverId: user._id }).select("roomId");
          const getLastMessage = await Message0.findOne({ roomId: getroom?.roomId });
    
          const LastMessage = getLastMessage?.message?.[getLastMessage?.message.length - 1] || null;
          let count = 0;
    
          if (getLastMessage) {
            count = getLastMessage.message.filter((msg) => msg.view === "0").length;
          }
          newusers.push({
            userId: user._id,
            name: user.name,
            media: user.media,
            last_message: LastMessage,
            unread_count: count,
          });
        }
        res.status(200).json(successResponse('OK', newusers, 'Record fetched successfully'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};



export const listzodiac = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await zodiacModel.find().select('name zodiac');
        res.status(200).json(successResponse('OK', record, 'Record fetched successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listSexualOrient = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await sexualOrientationModel.find().select('name');
        res.status(200).json(successResponse('OK', record, 'Record fetched successfully'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listLooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await lookingForModel.find().select('name');
        res.status(201).json(successResponse('OK', record, 'Service package fetch successfully'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listMeeting = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await meetingForModel.find().select('name');
        res.status(201).json(successResponse('OK', record, 'Fetch successfully'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listStatusCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await statusCategoriesModel.find().select('name');
        res.status(201).json(successResponse('OK', record, 'Fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listinterest = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await interestModel.find({ available: true }).select('name');
        res.status(200).json(successResponse('OK', record, 'Record fetched successfully'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listPriviterms = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await privacyModel.findOne({ status: true })
        res.status(200).json(successResponse('OK', record, 'Service package fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listTermsConditions = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await termsConditionModel.find({ status: true })
        res.status(200).json(successResponse('OK', record, 'Service package fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const listLanguages = async (req: Request, res: Response): Promise<void> => {
    try {
        const record = await languageModel.find({ available: true })
        res.status(200).json(successResponse('OK', record, 'Service package fetch successfully'));
        return
    } catch (error) {
        console.error('error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};
