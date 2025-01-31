import { Request, Response } from 'express';
import User from '../../models/userModel';
import bcrypt from 'bcryptjs';
import { errorResponse, successResponse } from '../../utils/responses';
import uploadPic from '../../utils/uploadcloudinary';
import mongoose from 'mongoose';
import { deleteFileToS3, uploadFileToS3 } from '../../utils/fileUpload';
import { config } from '../../config/config';

export const profile = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        let userId = req.authUser?.id
        let stepStart = payload.step
        delete payload.step;
        const userExit = await User.findOne({ _id: userId }).exec();
        switch (stepStart) {
            case 3:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 4:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 5:
                let privacySetting5 = {
                    ...userExit?.privacySettings,
                    hideGender: payload.hideGender,
                }
                let payloadBody5 = {
                    privacySettings: privacySetting5
                }
                await User.findOneAndUpdate({ _id: userId }, { $set: payloadBody5 });
                break;
            case 6:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 7:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 8:
                // let privacySetting6 = {
                //     ...userExit?.privacySettings,
                //     hidesexualOrientation: payload.hidesexualOrientation,
                // }
                let payloadBody = {
                    sexualOrientation: payload.sexualOrientation,
                    // privacySettings: privacySetting6
                }
                await User.findOneAndUpdate({ _id: userId }, { $set: payloadBody });
                break;
            case 9:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 10:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 11:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 12:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 13:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 14:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 15:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 16:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 17:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 18:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 19:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 20:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            case 21:
                await User.findOneAndUpdate({ _id: userId }, { $set: payload });
                break;
            default:
                break;
        }
        res.status(200).json(successResponse('OK', null, 'Profile update'));
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));

    }
};

export const about = async (req: Request, res: Response): Promise<void> => {
    try {
        let userId = req.authUser?.id;
        const { about } = req.body
        let user = await User.findByIdAndUpdate({ _id: userId }, { $set: { about: about } })
        res.status(200).json(successResponse('OK', user, 'Profile update'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const socialAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        let userId = req.authUser?.id;
        const { name, value } = req.body;
        let user = await User.findOne({ _id: userId })
        if (!user) {
            res.status(404).json(errorResponse('NOK', 'error', 'User not found'));
            return
        }
        const socialAccIndex = user.socialAcc.findIndex(acc => acc.name === name);

        if (socialAccIndex === -1) {
            user.socialAcc.push({ name, value });
            await user.save();
            res.status(200).json(successResponse('OK', null, 'successfully created'));
            return
        }
        user.socialAcc[socialAccIndex].value = value;
        await user.save();
        res.status(200).json(successResponse('OK', null, 'successfully updated'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const getprofile = async (req: Request, res: Response): Promise<void> => {
    try {
        let userId = req.authUser?.id
        let user = await User.findById({ _id: userId }).populate('stausCatogry interest lookingFor meetingFor sexualOrientation following followers', 'name')
        res.status(200).json(successResponse('OK', user, 'Profile update'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const userDetail = async (req: Request, res: Response): Promise<void> => {
    try {
        let id = req.params.id
        let user = await User.findById({ _id: id }).populate('stausCatogry interest lookingFor meetingFor sexualOrientation following followers', 'name')
        res.status(200).json(successResponse('OK', user, 'Profile update'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
}

export const upload = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json(errorResponse('NOK', 'error', 'file required'));
            return
        }
        let userId = req.authUser.id;

        if (!req.file) {
            res.status(400).json(errorResponse('NOK', 'error', 'file not found'));
            return
        }

        const fileUrl = await uploadFileToS3({ file: req.file, folder: '', userId: userId });

        res.status(200).json(successResponse('OK', `${config.awsUrl}${fileUrl}`, ` uploaded file successfully`));
        return
    } catch (error) {
        console.log('error', error);
        res.status(400).json(errorResponse('NOK', 'error', 'Please upload a valid image or PDF file and type'));
        return
    }
};

export const deletePic = async (req: Request, res: Response): Promise<void> => {
    try {
        const fileName = req.body.fileName as string;
        let fileUrl = fileName
        const deleteRec = await deleteFileToS3({ fileName });
        if (deleteRec) {
            fileUrl = ''
            res.status(200).json(successResponse('OK', { fileUrl: '' }, `File deleted successfully`));
        }
        res.status(400).json(errorResponse('NOK', fileUrl, 'something went wrong'));
    } catch (error) {
        console.log('error', error);
        res.status(400).json(errorResponse('NOK', 'error', 'Please upload a valid image or PDF file and type'));
    }
};


export const updatePrivacySettings = async (req: Request, res: Response): Promise<void> => {
    try {
        let payload = req.body;
        let userId = req.authUser?.id
        await User.findByIdAndUpdate({ _id: userId }, { $set: payload })
        res.status(200).json(successResponse('OK', null, 'Profile update'));
        return
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json(errorResponse('NOK', 'error', 'Something went wrong'));
        return
    }
};

export const getFilteredUsers = async (req: Request, res: Response): Promise<void> => {
    const loggedInUserId = req.authUser.id;

    const {
        gender,
        language,
        lookingFor,
        distance,
        isKid,
        height,
        education,
        location,
        page = 1,
        limit = 10
    } = req.query;

    try {
        const filters: any = {
            _id: { $ne: loggedInUserId },
            role: { $ne: 'admin' },
        };

        if (gender) filters.gender = gender;
        if (language) filters.language = { $in: language };
        if (lookingFor) filters.lookingFor = { $in: lookingFor };
        if (isKid !== undefined) filters.isKid = isKid === 'true';
        if (distance) filters.distance = { $lte: distance };
        if (height) filters.height = { $gte: height };
        if (education) filters.education = education;

        // if (location) {
        //     const [longitude, latitude] = location.split(',').map(coord => parseFloat(coord));
        //     filters.location = {
        //         $near: {
        //             $geometry: {
        //                 type: 'Point',
        //                 coordinates: [longitude, latitude],
        //             },
        //             $maxDistance: distance ? distance * 1000 : 10000, // Convert km to meters for distance
        //         },
        //     };
        // }

        const loggedInUser = await User.findById(loggedInUserId);
        if (!loggedInUser) {
            res.status(404).json(errorResponse('NOK', 'error', 'User not found.'));
            return
        }

        const privacyFilters: any = {};
        if (loggedInUser.privacySettings.hideEmail) privacyFilters.email = { $exists: false };
        if (loggedInUser.privacySettings.hidePhoneNumber) privacyFilters.phoneNumber = { $exists: false };
        if (loggedInUser.privacySettings.hideDob) privacyFilters.dob = { $exists: false };
        if (loggedInUser.privacySettings.hideAddress) privacyFilters.address = { $exists: false };
        if (loggedInUser.privacySettings.hideGender) privacyFilters.gender = { $exists: false };
        if (loggedInUser.privacySettings.hidesexualOrientation) privacyFilters.sexualOrientation = { $exists: false };

        const finalFilters = { ...filters, ...privacyFilters };

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const limitNumber = parseInt(limit as string);

        const filteredUsers = await User.find(finalFilters)
            .skip(skip)
            .limit(limitNumber)
            .populate('followers', 'name email')
            .populate('following', 'name email');

        const totalCount = await User.countDocuments(finalFilters);
        const totalPages = Math.ceil(totalCount / limitNumber);

        let data = {
            totalCount,
            currentPage: parseInt(page as string),
            totalPages,
            data: filteredUsers,
        };
        res.status(200).json(successResponse('OK', data, 'User list'));
        return
    } catch (error) {
        res.status(200).json(errorResponse('NOK', error, 'Error fetching filtered users.'));
        return
    }
};

export const getMatchUsers = async (req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.authUser.id;
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const limitNumber = parseInt(limit as string);

        const loggedInUser = await User.findById(userId)
            .populate('lookingFor')
            .populate('meetingFor')
            .populate('stausCatogry')
            .populate('interest')
            .exec();

        if (!loggedInUser) {
            res.status(404).json(errorResponse('NOK', null, 'User not found'));
            return
        }

        const { lookingFor, meetingFor, stausCatogry, interest } = loggedInUser;
        const preferences = {
            lookingFor: lookingFor.map((item) => item as string),
            meetingFor: meetingFor.map((item) => item as string),
            stausCatogry: stausCatogry.map((item) => item as string),
            interest: interest.map((item) => item as string),
        };

        const matchedUsers = await User.find({
            _id: { $ne: userId },
            $or: [
                { lookingFor: { $in: preferences.lookingFor } },
                { meetingFor: { $in: preferences.meetingFor } },
                { stausCatogry: { $in: preferences.stausCatogry } },
                { interest: { $in: preferences.interest } },
            ],
        })
            .skip(skip)
            .limit(limitNumber)
            .exec();

        const totalUsers = await User.countDocuments({
            _id: { $ne: userId },
            $or: [
                { lookingFor: { $in: preferences.lookingFor } },
                { meetingFor: { $in: preferences.meetingFor } },
                { stausCatogry: { $in: preferences.stausCatogry } },
                { interest: { $in: preferences.interest } },
            ],
        });
        const data = {
            data: matchedUsers,
            totalUsers,
            currentPage: parseInt(page as string),
            totalPages: Math.ceil(totalUsers / limitNumber)
        };

        res.status(200).json(successResponse('OK', data, 'User list'));
    } catch (error) {
        res.status(200).json(errorResponse('NOK', error, 'Error fetching filtered users.'));
        return
    }
}