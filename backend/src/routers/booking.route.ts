// routes/booking.routes.ts
import { Router } from 'express';
import bookingController from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

// Protected routes
router.get('/me', authMiddleware, bookingController.getMyBookings);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.post(
  '/:id/cancel',
  authMiddleware,
  bookingController.cancelBooking
);

// Admin-only routes
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN', 'ATTENDANT']),
  bookingController.getAllBookings
);

export {router as BookingRouter}