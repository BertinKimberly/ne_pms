// @ts-nocheck
import {
   PrismaClient,
   ParkingSlot,
   VehicleType,
   Booking,
   Parking,
   ParkingActivity,
   ParkingStatus,
} from "@prisma/client";
import { CreateBookingDto, ExtendBookingDto, CreateParkingDto } from "../types/custom.types";
import { BadRequestError, NotFoundError } from "../utils/helpers";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

class ParkingService {
   async getAllParkingSlots(): Promise<ParkingSlot[]> {
      return prisma.parkingSlot.findMany();
   }

   async getAvailableSlots(_vehicleType: VehicleType): Promise<ParkingSlot[]> {
      return prisma.parkingSlot.findMany({
         where: {
            isAvailable: true,
            // You can add vehicle type specific logic here
         },
      });
   }

   async bookSlot(bookingData: CreateBookingDto): Promise<Booking> {
      const { parkingSlotId, vehicleId, startTime } = bookingData;

      // Check if slot is available
      const slot = await prisma.parkingSlot.findUnique({
         where: { id: parkingSlotId },
      });

      if (!slot || !slot.isAvailable) {
         throw new Error("Parking slot is not available");
      }

      // Start transaction
      return prisma.$transaction(async (tx) => {
         // Create booking
         const booking = await tx.booking.create({
            data: {
               parkingSlotId,
               vehicleId,
               startTime: new Date(startTime),
               status: "ACTIVE",
            },
         });

         // Mark slot as occupied
         await tx.parkingSlot.update({
            where: { id: parkingSlotId },
            data: {
               isAvailable: false,
               vehicleId,
            },
         });

         return booking;
      });
   }

   async createParkingSlot(
      number: string,
      floor: number,
      isAvailable: boolean = true
   ): Promise<ParkingSlot> {
      //check is slot number already exists
      const existingSlot = await prisma.parkingSlot.findUnique({
         where: { number },
      });
      if (existingSlot) {
         throw new Error("Parking slot with this number already exists");
      }

      return prisma.parkingSlot.create({
         data: {
            number,
            floor,
            isAvailable,
         },
      });
   }

   async createBulkParkingSlots(slots: {
  number: string;
  floor: number;
  isAvailable?: boolean;
}[]): Promise<{ count: number }> {
  return prisma.$transaction(async (tx) => {
    // Check for duplicate slot numbers
    const existingNumbers = (
      await tx.parkingSlot.findMany({
        where: {
          number: {
            in: slots.map((s) => s.number),
          },
        },
        select: { number: true },
      })
    ).map((s) => s.number);

    if (existingNumbers.length > 0) {
      throw new Error(
        `These slot numbers already exist: ${existingNumbers.join(', ')}`
      );
    }

    const created = await tx.parkingSlot.createMany({
      data: slots.map((slot) => ({
        number: slot.number,
        floor: slot.floor,
        isAvailable: slot.isAvailable ?? true,
      })),
      skipDuplicates: false,
    });

    return { count: created.count };
  });
}


   async extendBooking(extendData: ExtendBookingDto): Promise<Booking> {
      const { bookingId, additionalHours } = extendData;

      const booking = await prisma.booking.findUnique({
         where: { id: bookingId },
      });

      if (!booking) {
         throw new Error("Booking not found");
      }

      const newEndTime = new Date(
         (booking.endTime ? booking.endTime : new Date()).getTime() +
            additionalHours * 60 * 60 * 1000
      );

      return prisma.booking.update({
         where: { id: bookingId },
         data: {
            endTime: newEndTime,
         },
      });
   }

   async releaseSlot(bookingId: string): Promise<Booking> {
      const booking = await prisma.booking.findUnique({
         where: { id: bookingId },
      });

      if (!booking) {
         throw new Error("Booking not found");
      }

      // Start transaction
      return prisma.$transaction(async (tx) => {
         // Update booking
         const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: {
               endTime: new Date(),
               status: "COMPLETED",
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

   async createParking(data: CreateParkingDto): Promise<Parking> {
      const existingParking = await prisma.parking.findUnique({
         where: { code: data.code },
      });

      if (existingParking) {
         throw new BadRequestError("Parking location with this code already exists");
      }

      return prisma.parking.create({
         data: {
            code: data.code,
            name: data.name,
            location: data.location,
            totalSpaces: data.totalSpaces,
            availableSpaces: data.totalSpaces,
            feePerHour: data.feePerHour,
         },
      });
   }

   async getParkingById(id: string): Promise<Parking> {
      const parking = await prisma.parking.findUnique({
         where: { id },
      });

      if (!parking) {
         throw new NotFoundError("Parking location not found");
      }

      return parking;
   }

   async getParkingByCode(code: string): Promise<Parking> {
      const parking = await prisma.parking.findUnique({
         where: { code },
      });

      if (!parking) {
         throw new NotFoundError("Parking location not found");
      }

      return parking;
   }

   async getAllParkings(): Promise<Parking[]> {
      return prisma.parking.findMany();
   }

   async updateParking(
      id: string,
      data: Partial<CreateParkingDto>
   ): Promise<Parking> {
      // First check if parking exists
      const existingParking = await prisma.parking.findUnique({
         where: { id },
      });

      if (!existingParking) {
         throw new NotFoundError("Parking location not found");
      }

      // Check if updating code and if the new code is already taken
      if (data.code && data.code !== existingParking.code) {
         const parkingWithSameCode = await prisma.parking.findUnique({
            where: { code: data.code },
         });

         if (parkingWithSameCode) {
            throw new BadRequestError("Parking location with this code already exists");
         }
      }

      return prisma.parking.update({
         where: { id },
         data,
      });
   }

   async deleteParking(id: string): Promise<Parking> {
      // First check if parking exists
      const parking = await prisma.parking.findUnique({
         where: { id },
      });

      if (!parking) {
         throw new NotFoundError("Parking location not found");
      }

      // Check if there are any active entries in this parking
      const activeEntries = await prisma.parkingActivity.findFirst({
         where: {
            parkingId: id,
            exitDateTime: null,
         },
      });

      if (activeEntries) {
         throw new BadRequestError("Cannot delete parking with active entries");
      }

      return prisma.parking.delete({
         where: { id },
      });
   }

   async updateAvailableSpaces(id: string, increment: boolean): Promise<Parking> {
      const parking = await prisma.parking.findUnique({
         where: { id },
      });

      if (!parking) {
         throw new NotFoundError("Parking location not found");
      }

      // If increment is true, we're adding a space (car leaving)
      // If increment is false, we're removing a space (car entering)
      const newAvailableSpaces = increment
         ? parking.availableSpaces + 1
         : parking.availableSpaces - 1;

      if (newAvailableSpaces < 0) {
         throw new BadRequestError("No available parking spaces");
      }

      if (newAvailableSpaces > parking.totalSpaces) {
         throw new BadRequestError("Available spaces cannot exceed total spaces");
      }

      return prisma.parking.update({
         where: { id },
         data: {
            availableSpaces: newAvailableSpaces,
         },
      });
   }

   async recordVehicleEntry(data): Promise<ParkingActivity> {
      const vehicle = await prisma.vehicle.findUnique({
         where: { id: data.vehicleId },
      });

      if (!vehicle) {
         throw new NotFoundError("Vehicle not found");
      }

      const parking = await prisma.parking.findUnique({
         where: { id: data.parkingId },
      });

      if (!parking) {
         throw new NotFoundError("Parking location not found");
      }

      if (parking.availableSpaces <= 0) {
         throw new BadRequestError("No available parking spaces");
      }

      // Check if vehicle is already parked
      const activeActivity = await prisma.parkingActivity.findFirst({
         where: {
            vehicleId: data.vehicleId,
            status: ParkingStatus.ACTIVE,
         },
      });

      if (activeActivity) {
         throw new BadRequestError("Vehicle is already parked in another location");
      }

      const ticketNumber = `TICKET-${uuidv4().substring(0, 8).toUpperCase()}`;

      return prisma.$transaction(async (tx) => {
         // Decrease available spaces
         await tx.parking.update({
            where: { id: data.parkingId },
            data: { availableSpaces: { decrement: 1 } },
         });

         // Create entry record
         return tx.parkingActivity.create({
            data: {
               vehicleId: data.vehicleId,
               parkingId: data.parkingId,
               userId: data.userId,
               ticketNumber,
               status: ParkingStatus.ACTIVE,
            },
         });
      });
   }

   async recordVehicleExit(id: string): Promise<ParkingActivity> {
      const activity = await prisma.parkingActivity.findUnique({
         where: { id },
         include: { parking: true },
      });

      if (!activity) {
         throw new NotFoundError("Parking activity not found");
      }

      if (activity.status === ParkingStatus.COMPLETED) {
         throw new BadRequestError("Vehicle has already exited");
      }

      const exitTime = new Date();
      const durationHours = (exitTime.getTime() - activity.entryDateTime.getTime()) / (1000 * 60 * 60);

      return prisma.$transaction(async (tx) => {
         // Increase available spaces
         await tx.parking.update({
            where: { id: activity.parkingId },
            data: { availableSpaces: { increment: 1 } },
         });

         // Update activity record
         return tx.parkingActivity.update({
            where: { id },
            data: {
               exitDateTime: exitTime,
               status: ParkingStatus.COMPLETED,
               duration: durationHours,
            },
         });
      });
   }

   async getActivityById(id: string): Promise<ParkingActivity> {
      const activity = await prisma.parkingActivity.findUnique({
        where: { id },
        include: {
          vehicle: true,
          parking: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });
    
      if (!activity) {
        throw new NotFoundError("Parking activity not found");
      }
    
      return activity;
    }

    async getActiveVehicles(): Promise<ParkingActivity[]> {
      return prisma.parkingActivity.findMany({
        where: {
          status: ParkingStatus.ACTIVE,
        },
        include: {
          vehicle: true,
          parking: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });
    }

   async getVehicleActivitiesByDateRange(startDate: Date, endDate: Date): Promise<ParkingActivity[]> {
      return prisma.parkingActivity.findMany({
         where: {
            entryDateTime: {
               gte: startDate,
               lte: endDate,
            },
         },
         include: {
            vehicle: true,
            parking: true,
            user: {
               select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: true,
               },
            },
         },
      });
   }

   async getCompletedActivitiesByDateRange(startDate: Date, endDate: Date): Promise<ParkingActivity[]> {
      return prisma.parkingActivity.findMany({
         where: {
            exitDateTime: {
               gte: startDate,
               lte: endDate,
            },
            status: ParkingStatus.COMPLETED,
         },
         include: {
            vehicle: true,
            parking: true,
            user: {
               select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: true,
               },
            },
         },
      });
   }

   async generateEntryTicket(id: string) {
      const activity = await prisma.parkingActivity.findUnique({
         where: { id },
         include: {
            vehicle: true,
            parking: true,
         },
      });

      if (!activity) {
         throw new NotFoundError("Parking activity not found");
      }

      return {
         ticketNumber: activity.ticketNumber,
         plateNumber: activity.vehicle.plateNumber,
         vehicleType: activity.vehicle.type,
         entryDateTime: activity.entryDateTime,
         parkingName: activity.parking.name,
         parkingCode: activity.parking.code,
         location: activity.parking.location,
         feePerHour: activity.parking.feePerHour,
      };
   }

   async generateParkingSummary(id: string) {
      const activity = await prisma.parkingActivity.findUnique({
         where: { id },
         include: {
            vehicle: true,
            parking: true,
         },
      });

      if (!activity) {
         throw new NotFoundError("Parking activity not found");
      }

      if (!activity.exitDateTime) {
         // For active parking, generate an estimate
         const tempExitTime = new Date();
         const durationHours = (tempExitTime.getTime() - activity.entryDateTime.getTime()) / (1000 * 60 * 60);
         
         return {
            ticketNumber: activity.ticketNumber,
            plateNumber: activity.vehicle.plateNumber,
            vehicleType: activity.vehicle.type,
            entryDateTime: activity.entryDateTime,
            estimatedExitDateTime: tempExitTime,
            parkingName: activity.parking.name,
            parkingCode: activity.parking.code,
            estimatedDuration: `${durationHours.toFixed(2)} hours`,
            feePerHour: activity.parking.feePerHour,
            isEstimate: true,
         };
      } else {
         // For completed parking
         return {
            ticketNumber: activity.ticketNumber,
            plateNumber: activity.vehicle.plateNumber,
            vehicleType: activity.vehicle.type,
            entryDateTime: activity.entryDateTime,
            exitDateTime: activity.exitDateTime,
            parkingName: activity.parking.name,
            parkingCode: activity.parking.code,
            duration: activity.duration ? `${activity.duration.toFixed(2)} hours` : 'N/A',
            feePerHour: activity.parking.feePerHour,
            isEstimate: false,
         };
      }
   }
}

export default new ParkingService();
