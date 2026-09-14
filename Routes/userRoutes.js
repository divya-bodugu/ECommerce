import express from 'express';
import {
    getAllUsers,
    deleteUserById
} from '../Controllers/adminController.js';

import { tokenVerify  } from '../middleware/tokenVerify.js';
const router= express.Router();
router.get('/', tokenVerify, getAllUsers);
router.delete('/:id', tokenVerify, deleteUserById);
export default router;