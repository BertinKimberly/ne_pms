// controllers/booking.controller.ts
import { Request, Response } from "express";
import bookingService from "../services/booking.service";
import { BadRequestError } from "../utils/helpers";

class BookingController {
   async getBookingById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const booking = await bookingService.getBookingById(id);
         if (!booking) {
            throw new BadRequestError("Booking not found");
         }
         res.json(booking);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getMyBookings(req: Request, res: Response) {
      try {
         if (!req.user) {
            throw new BadRequestError("User not authenticated");
         }
         //@ts-ignore
         const bookings = await bookingService.getUserBookings(req.user.id);
         res.json(bookings);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async cancelBooking(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const booking = await bookingService.cancelBooking(id);
         res.json(booking);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getAllBookings(_req: Request, res: Response) {
      try {
         const bookings = await bookingService.getAllBookings();
         res.json(bookings);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }
}

export default new BookingController();
