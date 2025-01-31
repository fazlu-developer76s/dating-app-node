import { Router } from 'express';
import { getUser, getUserList, listinterest, listLanguages, listLooking, listMeeting, listPriviterms, listSexualOrient, listStatusCategory, listzodiac } from '../../controllers/globalcontroller/userController';
import { servicePackageList } from '../../controllers/admin/servicePackageController';
import { listPreference } from '../../controllers/admin/preferencesController';
const router = Router();

// user profile and data show and hide api
router.get('/user/:id', getUser);
router.get('/userList', getUserList);
router.get('/package', servicePackageList);
router.get('/relationShip', listLooking);
router.get('/meeting', listMeeting);
router.get('/statusList', listStatusCategory);
router.get('/zodiac', listzodiac);
router.get('/sexualOrientation', listSexualOrient);

router.get('/interest', listinterest);
router.get('/peference', listPreference);
router.get('/priviterms', listPriviterms);
// router.get('/terms-condition', listTermsConditions);
router.get('/language', listLanguages);



export default router;