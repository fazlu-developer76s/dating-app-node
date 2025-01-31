import { Router } from 'express';
import { validateSchema, validateSchemaStep } from '../../middleware/schemaValidation';
import { about, deletePic, getFilteredUsers, getMatchUsers, getprofile, profile, socialAccount, updatePrivacySettings, upload, userDetail } from '../../controllers/userController/profileController';
import { blockUnblockSchema, cancelFollowRequestSchema, privacySettingsSchema, profileSchema, responseFollowRequest, senderFollowRequest, userUnblockSchema } from '../../validation/userValidation';
import { uploadMedia } from '../../config/multerConfig';
import { acceptFollowRequest, cancelFollowRequest, listFollower, listFollowing, listFollowRequest, rejectFollowRequest, sendFollowRequest } from '../../controllers/userController/followRequesController';
import { blockUser, listblock, matchList, unblockUser } from '../../controllers/userController/blockController';

const router = Router();

// user profile and data show and hide api
// router.put('/profile', validateSchema(profileSchema), profile);
router.put('/updatePrivacy', validateSchema(privacySettingsSchema), updatePrivacySettings);


router.post('/upload', uploadMedia.single('file'), upload)
router.put('/upload', deletePic)

//  profile
router.get('/profile', getprofile);
router.get('/userDetail/:id', userDetail);
router.put('/profile', validateSchemaStep(), profile);
router.put('/about', about);
router.put('/socialAccount', socialAccount);

// user list login
router.get('/list', getFilteredUsers);
router.get('/matchList', getMatchUsers);

// crud of follow
router.post('/send-follow-request', validateSchema(senderFollowRequest), sendFollowRequest);
router.post('/accept-follow-request', validateSchema(responseFollowRequest), acceptFollowRequest);
router.post('/reject-follow-request', validateSchema(responseFollowRequest), rejectFollowRequest);
router.post('/cancel-follow-request', validateSchema(cancelFollowRequestSchema), cancelFollowRequest);

router.get('/list-follower', listFollower);
router.get('/list-following', listFollowing);

router.post('/people', validateSchema(blockUnblockSchema), blockUser);
router.put('/people/:id', validateSchema(userUnblockSchema), unblockUser);
router.get('/people', listblock);
router.get('/match', matchList);

router.get('/list-follow-request', listFollowRequest);

export default router;