import express from 'express';
import { getProfile, updateName, changePassword, uploadAvatar, deleteAvatar, updateLanguage   } from '../controllers/profileController.js';



const router = express.Router();

router.get('/', getProfile);
router.put('/name', updateName);
router.put('/change-password', changePassword);
router.put('/avatar', uploadAvatar);
router.delete('/avatar', deleteAvatar);
router.put('/language', updateLanguage);

export default router;
