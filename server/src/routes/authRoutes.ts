import express from 'express';
import AuthController from '../controllers/authController';

const router = express.Router();

router.post('/', AuthController.login);
router.post('/logout/:id', AuthController.logout);

export default router;
