// @ts-nocheck
import { PrismaClient, Booking, BookingStatus } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../utils/helpers";

const prisma = new PrismaClient();

class BookingService {
   async getBookingById(id: string): Promise<Booking | null> {
      return prisma.booking.findUnique({
         where: { id },
         include: {
            parkingSlot: true,
            vehicle: true,
         },
      });
   }

   async getUserBookings(userId: string): Promise<Booking[]> {
      return prisma.booking.findMany({
         where: {
            vehicle: {
               userId,
            },
         },
         include: {
            parkingSlot: true,
            vehicle: true,
         },
         orderBy: {
            startTime: "desc",
         },
      });
   }

   async getAllBookings(): Promise<Booking[]> {
      return prisma.booking.findMany({
         include: {
            parkingSlot: true,
            vehicle: {
               include: {
                  user: {
                     select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                     },
                  },
               },
            },
         },
         orderBy: {
            startTime: "desc",
         },
      });
   }

   async cancelBooking(bookingId: string): Promise<Booking> {
      return prisma.$transaction(async (tx) => {
         const booking = await tx.booking.findUnique({
            where: { id: bookingId },
         });

         if (!booking) {
            throw new NotFoundError("Booking not found");
         }

         if (booking.status !== "ACTIVE") {
            throw new BadRequestError("Only active bookings can be cancelled");
         }

         // Update booking
         const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: {
               status: "CANCELLED",
               endTime: new Date(),
            },
         });

         // Mark slot as available
         await tx.parkingSlot.update({
            where: { id: booking.parkingSlotId },
            data: {
               isAvailable: true,
               vehicleId: null,
            },
         });

         return updatedBooking;
      });
   }

   async checkOverstayBookings(): Promise<void> {
      // Find all active bookings that have exceeded their expected duration
      const overstayBookings = await prisma.booking.findMany({
         where: {
            status: "ACTIVE",
            endTime: {
               lt: new Date(), // endTime is in the past
            },
         },
      });

      // Mark them as overstay
      for (const booking of overstayBookings) {
         await prisma.booking.update({
            where: { id: booking.id },
            data: {
               status: "OVERSTAY",
            },
         });
      }
   }
}

export default new BookingService();
