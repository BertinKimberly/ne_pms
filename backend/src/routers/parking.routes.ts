import { Router } from "express";
import parkingController from "../controllers/parking.controller";
import {
   CreateBookingDto,
   CreateParkingDto,
   CreateParkingSlotDto,
   DateRangeDto,
   ExtendBookingDto,
   ParkingEntryDto,
} from "../types/custom.types";
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';
import { validateDto } from "../middlewares/validation.middleware";



const router = Router();

// Public routes
router.get("/slots", parkingController.getParkingSlots);
router.get("/slots/available", parkingController.getAvailableSlots);

// Add these routes before the export
router.post(
   "/slots",
   authenticate,
   authorize(Role.ADMIN),
   validateDto(CreateParkingSlotDto),
   parkingController.createParkingSlot
);

router.post(
   "/slots/bulk",
   authenticate,
   authorize(Role.ADMIN),
   parkingController.createBulkParkingSlots
);

// Protected routes
router.post(
   "/book",
   authenticate,
   authorize(Role.USER),
   validateDto(CreateBookingDto),
   parkingController.bookSlot
);

router.post(
   "/extend",
   authenticate,
   authorize(Role.USER),
   validateDto(ExtendBookingDto),
   parkingController.extendBooking
);

router.post(
   "/release/:bookingId",
   authenticate,
   authorize(Role.ADMIN, Role.ATTENDANT),
   parkingController.releaseSlot
);

// Public routes - parking attendants and users can view available parkings
router.get('/', parkingController.getAllParkings);
router.get('/locations/:id', parkingController.getParkingById);
router.get('/locations/code/:code', parkingController.getParkingByCode);

// Protected routes - only admin can create, update, delete parkings
router.post(
  '/locations', 
  authenticate, 
  authorize(Role.ADMIN), 
  validateDto(CreateParkingDto), 
  parkingController.createParking
);

router.put(
  '/locations/:id', 
  authenticate, 
  authorize(Role.ADMIN), 
  validateDto(CreateParkingDto), 
  parkingController.updateParking
);

router.delete(
  '/locations/:id', 
  authenticate, 
  authorize(Role.ADMIN), 
  parkingController.deleteParking
);

// Vehicle activity management routes
// Protected routes - attendants and admins can record entries and exits
router.post(
  '/activities/entry', 
  authenticate, 
  authorize(Role.ADMIN, Role.ATTENDANT), 
  validateDto(ParkingEntryDto),
  parkingController.recordVehicleEntry
);

router.post(
  '/activities/:id/exit', 
  authenticate, 
  authorize(Role.ADMIN, Role.ATTENDANT), 
  parkingController.recordVehicleExit
);

router.get(
  '/activities/:id', 
  authenticate, 
  parkingController.getActivityById
);

router.get(
  '/activities/active', 
  authenticate, 
  authorize(Role.ADMIN, Role.ATTENDANT),
  parkingController.getActiveVehicles
);

// Ticket and summary generation
router.get(
  '/activities/:id/ticket', 
  authenticate, 
  authorize(Role.ADMIN, Role.ATTENDANT), 
  parkingController.generateEntryTicket
);

router.get(
  '/activities/:id/summary', 
  authenticate, 
  authorize(Role.ADMIN, Role.ATTENDANT), 
  parkingController.generateParkingSummary
);

// Reporting routes
router.get(
   '/reports/entries', 
   authenticate, 
   authorize(Role.ADMIN), 
   validateDto(DateRangeDto),
   parkingController.getActivitiesByDateRange
 );
 
 router.get(
   '/reports/exits', 
   authenticate, 
   authorize(Role.ADMIN), 
   validateDto(DateRangeDto),  
   parkingController.getCompletedActivitiesByDateRange
 );

export default router;
