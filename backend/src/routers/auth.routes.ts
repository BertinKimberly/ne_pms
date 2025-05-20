// routes/user.routes.ts
import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateUserDto, LoginDto } from '../types/custom.types';


const router = Router();

// Public routes
router.post('/register', validateDto(CreateUserDto), authController.register);
router.post('/login', validateDto(LoginDto), authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);

export default router;