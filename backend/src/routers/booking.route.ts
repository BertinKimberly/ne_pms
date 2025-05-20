// routes/booking.routes.ts
import { Router } from 'express';
import bookingController from '../controllers/booking.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateBookingDto } from '../types/custom.types';

const router = Router();

// Protected routes
router.get(
  '/me', 
  authenticate, 
  bookingController.getMyBookings
);

router.get(
  '/:id', 
  authenticate, 
  bookingController.getBookingById
);

router.post(
  '/',
  authenticate,
  authorize(Role.USER),
  validateDto(CreateBookingDto),
  bookingController.createBooking
);

router.post(
  '/:id/cancel',
  authenticate,
  bookingController.cancelBooking
);

// Admin and Attendant routes
router.get(
  '/',
  authenticate,
  authorize(Role.ADMIN, Role.ATTENDANT),
  bookingController.getAllBookings
);

export default router;