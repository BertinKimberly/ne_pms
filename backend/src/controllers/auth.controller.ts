import { Request, Response } from 'express';
import userService from '../services/user.service';
import { CreateUserDto, LoginDto } from '../types/custom.types';
import { BadRequestError } from '../utils/helpers';
import authService from '../services/auth.service';
import { sendResponse } from '../response';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const userData: CreateUserDto = req.body;
      const user = await authService.register(userData);
      sendResponse(res, 201, true, 'User registered successfully', user);
    } catch (error) {
      sendResponse(res, error.statusCode || 500, false, error.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginDto = req.body;
      const { user, token } = await authService.login(loginData);
      sendResponse(res, 200, true, 'Login successful', { user, token });
    } catch (error) {
      sendResponse(res, error.statusCode || 500, false, error.message);
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      // @ts-ignore
      if (!req.user || !req.user.id) {
        throw new BadRequestError('User not authenticated');
      }
      // @ts-ignore
      const user = await userService.getUserById(req.user.id);
      sendResponse(res, 200, true, 'Profile retrieved successfully', user);
    } catch (error) {
      sendResponse(res, error.statusCode || 500, false, error.message);
    }
  }
}

export default new AuthController();