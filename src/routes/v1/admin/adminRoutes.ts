import { Router } from 'express';
import { validateSchema } from '../../../middleware/schemaValidation';
import { faqSchema, interestSchema, languageSchema, lookingSchema, meetingSchema, peferenceSchema, privitermSchema, serviceSchema, sexualOrientationSchema, statusCategoriesSchema } from '../../../validation/adminValidation';
import { deleteservicePackage, servicePackage, servicePackageList, updateservicePackage } from '../../../controllers/admin/servicePackageController';
import { createLookingFor, deleteLookingFor, listLookingFor, updateLookingFor } from '../../../controllers/admin/lookingForController';
import { createStatusCategories, deleteStatusCategories, listStatusCategories, updateStatusCategories } from '../../../controllers/admin/statusCategoriesController';
import { createMeetingFor, deleteMeetingFor, listMeetingFor, updateMeetingFor } from '../../../controllers/admin/meetingForController';
import { createSexualOrientation, deleteSexualOrientation, listSexualOrientation, updateSexualOrientation } from '../../../controllers/admin/SexualOrientationController';
import { deleteUser, getUserList } from '../../../controllers/admin/userController';
import { createInterest, deleteInterest, listInterest, updateInterest } from '../../../controllers/admin/interestController';
import { uploadMedia } from '../../../config/multerConfig';
import { deletePic, upload } from '../../../controllers/userController/profileController';
import { createLanguage, deleteLanguage, listLanguage, updateLanguage } from '../../../controllers/admin/languageController';
import { createPeference, deletePeference, listPreference, updatePeference } from '../../../controllers/admin/preferencesController';
import { createPriviterm, deletePriviterm, listPriviterm, updatePriviterm } from '../../../controllers/admin/privitermController';
import { createFaq, deleteFaq, listFaq, updateFaq } from '../../../controllers/admin/faqController';
const router = Router();

// for perice package
router.post('/service', validateSchema(serviceSchema), servicePackage);
router.get('/service', servicePackageList);
router.put('/service/:id', validateSchema(serviceSchema), updateservicePackage);
router.delete('/service/:id', deleteservicePackage);


// looking for record
router.post('/relationShip', validateSchema(lookingSchema), createLookingFor);
router.get('/relationShip', listLookingFor);
router.put('/relationShip/:id', validateSchema(lookingSchema), updateLookingFor);
router.delete('/relationShip/:id', deleteLookingFor);

// status category for record
router.post('/status', validateSchema(statusCategoriesSchema), createStatusCategories);
router.get('/status', listStatusCategories);
router.put('/status/:id', validateSchema(statusCategoriesSchema), updateStatusCategories);
router.delete('/status/:id', deleteStatusCategories);

// meeting for record
router.post('/meeting', validateSchema(meetingSchema), createMeetingFor);
router.get('/meeting', listMeetingFor);
router.put('/meeting/:id', validateSchema(meetingSchema), updateMeetingFor);
router.delete('/meeting/:id', deleteMeetingFor);

// meeting for SexualOrientation
router.post('/sexualOrientation', validateSchema(sexualOrientationSchema), createSexualOrientation);
router.get('/sexualOrientation', listSexualOrientation);
router.put('/sexualOrientation/:id', validateSchema(sexualOrientationSchema), updateSexualOrientation);
router.delete('/sexualOrientation/:id', deleteSexualOrientation);

// interest for records
router.post('/interest', validateSchema(interestSchema), createInterest);
router.get('/interest', listInterest);
router.put('/interest/:id', validateSchema(interestSchema), updateInterest);

router.delete('/interest/:id', deleteInterest);

router.post('/language', validateSchema(languageSchema), createLanguage);
router.get('/language', listLanguage);
router.put('/language/:id', validateSchema(languageSchema), updateLanguage);
router.delete('/language/:id', deleteLanguage);

// for user
router.get('/user', getUserList);
router.delete('/user-delete/:id', deleteUser);

router.post('/upload-pic', uploadMedia.single('file'), upload)
router.put('/upload-pic', deletePic)


router.post('/priviterms', validateSchema(privitermSchema), createPriviterm);
router.get('/priviterms', listPriviterm);
router.put('/priviterms/:id', validateSchema(privitermSchema), updatePriviterm);
router.delete('/priviterms/:id', deletePriviterm);

// router.post('/terms-condition', validateSchema(privacySchema), createTermsCondition);
// router.get('/terms-condition', listTermsCondition);
// router.put('/terms-condition/:id', validateSchema(privacySchema), updateTermsCondition);
// router.get('/terms-condition/:id', getTermsCondition);


router.post('/peference', validateSchema(peferenceSchema), createPeference);
router.get('/peference', listPreference);
router.put('/peference/:id', validateSchema(peferenceSchema), updatePeference);
router.delete('/peference/:id', deletePeference);

router.post('/faq', validateSchema(faqSchema), createFaq);
router.get('/faq', listFaq);
router.put('/faq/:id', validateSchema(faqSchema), updateFaq);
router.delete('/faq/:id', deleteFaq);


export default router;