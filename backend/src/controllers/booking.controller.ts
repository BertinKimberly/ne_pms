// controllers/booking.controller.ts
import { Request, Response } from "express";
import bookingService from "../services/booking.service";
import { BadRequestError } from "../utils/helpers";
import { sendResponse } from "../response";

class BookingController {
   async getBookingById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const booking = await bookingService.getBookingById(id);
         if (!booking) {
            throw new BadRequestError("Booking not found");
         }
         sendResponse(res, 200, true, "Booking retrieved successfully", booking);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async getMyBookings(req: Request, res: Response) {
      try {
         if (!req.user) {
            throw new BadRequestError("User not authenticated");
         }
         //@ts-ignore
         const bookings = await bookingService.getUserBookings(req.user.id);
         sendResponse(res, 200, true, "User bookings retrieved successfully", bookings);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async createBooking(req: Request, res: Response) {
      try {
         if (!req.user) {
            throw new BadRequestError("User not authenticated");
         }
         
         const { parkingSlotId, vehicleId, startTime } = req.body;
         //@ts-ignore
         const booking = await bookingService.createBooking(req.user.id, parkingSlotId, vehicleId, startTime);
         
         sendResponse(res, 201, true, "Booking created successfully", booking);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async cancelBooking(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const booking = await bookingService.cancelBooking(id);
         sendResponse(res, 200, true, "Booking cancelled successfully", booking);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async getAllBookings(_req: Request, res: Response) {
      try {
         const bookings = await bookingService.getAllBookings();
         sendResponse(res, 200, true, "All bookings retrieved successfully", bookings);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }
}

export default new BookingController();
