import { Request, Response } from 'express';

import FollowRequestModel from '../../models/followRequestModel';
import User from '../../models/userModel';
import { errorResponse, successResponse } from '../../utils/responses';
import mongoose from 'mongoose';
import FollowingModel from '../../models/followingModel';
import followerModel from '../../models/followerModel';

export const sendFollowRequest = async (req: Request, res: Response): Promise<void> => {
    const { receiverId } = req.body;
    try {
        const senderId = req.authUser.id;

        if (senderId.toString() === receiverId.toString()) {
            res.status(400).json(errorResponse('NOK', 'error', 'You cannot follow yourself.'));
            return
        }

        const existingRequest = await FollowRequestModel.findOne({
            senderId,
            receiverId,
            status: 'pending'
        });

        if (existingRequest) {
            res.status(400).json(errorResponse('NOK', 'error', 'You have already sent a follow request.'));
            return
        }

        const followRequest = new FollowRequestModel({
            senderId,
            receiverId,
            status: 'pending',
        });

        await followRequest.save();
        res.status(201).json(errorResponse('OK', null, 'Follow request sent.'));
        return
    } catch (error) {
        res.status(500).json(errorResponse('NOK', error, 'Error sending follow request.'));
        return
    }
};

export const listFollowRequest = async (req: Request, res: Response): Promise<void> => {
    const userId = req.authUser.id
    try {
        let users = await FollowRequestModel.find({ receiverId: userId, status: { $nin: ["accepted"] } }).select('senderId receiverId status').populate('senderId', '_id name profilePic media').populate('receiverId', '_id name profilePic media').lean()
        res.status(200).json(successResponse('OK', users, 'Follow request sent.'));
        return
    } catch (error) {
        res.status(500).json(errorResponse('NOK', error, 'Error sending follow request.'));
        return
    }
};

export const listFollower = async (req: Request, res: Response): Promise<void> => {
    const userId = req.authUser.id
    try {
        let users = await FollowRequestModel.find({ receiverId: userId, status: 'accepted' }).select('senderId status receiverId').populate('senderId', '_id name profilePic media').populate('receiverId', '_id name profilePic media').lean()
        res.status(200).json(successResponse('OK', users, 'Follow request sent.'));
        return
    } catch (error) {
        res.status(500).json(errorResponse('NOK', error, 'Error sending follow request.'));
        return
    }
};

export const listFollowing = async (req: Request, res: Response): Promise<void> => {
    const userId = req.authUser.id
    try {
        let users = await FollowRequestModel.find({ receiverId: userId, status: 'accepted' }).select('senderId status').populate('senderId', '_id name profilePic media').lean()
        res.status(200).json(successResponse('OK', users, 'Follow request sent.'));
        return
    } catch (error) {
        res.status(500).json(errorResponse('NOK', error, 'Error sending follow request.'));
        return
    }
};

export const acceptFollowRequest = async (req: Request, res: Response): Promise<void> => {
    const { receiverId } = req.body;
    const userId = req.authUser.id;

    const followRequest = await FollowRequestModel.findById(receiverId);

    if (!followRequest) {
        res.status(404).json(errorResponse('NOK', 'error', 'Follow request not found.'));
        return
    }

    if (followRequest.receiverId.toString() !== userId.toString()) {
        res.status(403).json(errorResponse('NOK', 'error', 'You cannot accept this request.'));
        return
    }

    if (followRequest.status === 'accepted') {
        res.status(400).json(errorResponse('NOK', 'error', 'This follow request has already been accepted.'));
        return
    }

    followRequest.status = 'accepted';
    await followRequest.save();

    const following = new FollowingModel({
        userId: followRequest.senderId,
        followingUserId: followRequest.receiverId,
    });

    const follower = new FollowingModel({
        userId: followRequest.receiverId,
        followedUserId: followRequest.senderId,
    });

    await following.save();
    await follower.save();
    res.status(200).json(successResponse('OK', null, 'Follow request accepted.'));
    return
};

export const cancelFollowRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userIdToUnfollow } = req.body;
        const currentUserId = req.authUser.id;

        if (currentUserId.toString() === userIdToUnfollow.toString()) {
            res.status(400).json(errorResponse('OK', null, 'You cannot unfollow yourself.'));
            return
        }

        const followingRecord = await FollowingModel.findOneAndDelete({
            userId: currentUserId,
            followingUserId: userIdToUnfollow,
        });

        if (!followingRecord) {
            res.status(404).json(errorResponse('OK', null, 'You are not following this user.'));
            return
        }

        const followerRecord = await followerModel.findOneAndDelete({
            userId: userIdToUnfollow,
            followedUserId: currentUserId,
        });

        if (!followerRecord) {
            res.status(404).json(errorResponse('OK', null, 'This user is not following you.'));
            return
        }
        res.status(200).json(successResponse('OK', null, 'Successfully unfollowed the user.'));
    } catch (error) {
        res.status(500).json(errorResponse('NOK', error, 'Error canceling follow request.'));
        return
    }
};

export const rejectFollowRequest = async (req: Request, res: Response): Promise<void> => {
    const { requestId } = req.body;
    const receiverId = req.authUser.id;

    const followRequest = await FollowRequestModel.findById(requestId);

    if (!followRequest) {
        res.status(404).json(errorResponse('NOK', 'error', 'Follow request not found.'));
        return
    }
    if (followRequest.receiverId.toString() !== receiverId.toString()) {
        res.status(403).json(errorResponse('NOK', 'error', 'You cannot reject this request.'));
        return
    }

    if (followRequest.status === 'rejected') {
        res.status(400).json(errorResponse('NOK', 'error', 'This follow request has already been rejected.'));
        return
    }

    followRequest.status = 'rejected';
    await followRequest.save();
    res.status(200).json(successResponse('OK', null, 'Follow request rejected.'));
    return
};
