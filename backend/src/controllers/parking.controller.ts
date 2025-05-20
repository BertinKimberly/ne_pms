
import { Request, Response } from "express";
import { sendResponse } from '../response';
import parkingService from "../services/parking.service";
import { CreateBookingDto, ExtendBookingDto, CreateParkingDto } from "../types/custom.types";

class ParkingController {
   async getParkingSlots(_req: Request, res: Response) {
      try {
         const slots = await parkingService.getAllParkingSlots();
         res.json(slots);
      } catch (error) {
         res.status(500).json({ message: error.message });
      }
   }

   async createParkingSlot(req: Request, res: Response) {
      try {
         const { number, floor, isAvailable } = req.body;
         const slot = await parkingService.createParkingSlot(
            number,
            floor,
            isAvailable
         );
         res.status(201).json(slot);
      } catch (error) {
         res.status(400).json({ message: error.message });
      }
   }

   async createBulkParkingSlots(req: Request, res: Response) {
  try {
    const { slots } = req.body;
    if (!Array.isArray(slots)) {
      throw new Error('Slots must be an array');
    }
    const result = await parkingService.createBulkParkingSlots(slots);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

   async getAvailableSlots(req: Request, res: Response) {
      try {
         const { vehicleType } = req.query;
         const slots = await parkingService.getAvailableSlots(
            vehicleType as any
         );
         res.json(slots);
      } catch (error) {
         res.status(500).json({ message: error.message });
      }
   }

   async bookSlot(req: Request, res: Response) {
      try {
         const bookingData: CreateBookingDto = req.body;
         const booking = await parkingService.bookSlot(bookingData);
         res.status(201).json(booking);
      } catch (error) {
         res.status(400).json({ message: error.message });
      }
   }

   async extendBooking(req: Request, res: Response) {
      try {
         const extendData: ExtendBookingDto = req.body;
         const booking = await parkingService.extendBooking(extendData);
         res.json(booking);
      } catch (error) {
         res.status(400).json({ message: error.message });
      }
   }

   async releaseSlot(req: Request, res: Response) {
      try {
         const { bookingId } = req.params;
         const booking = await parkingService.releaseSlot(bookingId);
         res.json(booking);
      } catch (error) {
         res.status(400).json({ message: error.message });
      }
   }

   async createParking(req: Request, res: Response) {
      try {
         const parkingData: CreateParkingDto = req.body;
         const parking = await parkingService.createParking(parkingData);
         sendResponse(res, 201, true, 'Parking location created successfully', parking);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async getParkingById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const parking = await parkingService.getParkingById(id);
         sendResponse(res, 200, true, 'Parking location retrieved successfully', parking);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async getParkingByCode(req: Request, res: Response) {
      try {
         const { code } = req.params;
         const parking = await parkingService.getParkingByCode(code);
         sendResponse(res, 200, true, 'Parking location retrieved successfully', parking);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async getAllParkings(_req: Request, res: Response) {
      try {
         const parkings = await parkingService.getAllParkings();
         sendResponse(res, 200, true, 'Parking locations retrieved successfully', parkings);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async updateParking(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const parkingData = req.body;
         const parking = await parkingService.updateParking(id, parkingData);
         sendResponse(res, 200, true, 'Parking location updated successfully', parking);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async deleteParking(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const parking = await parkingService.deleteParking(id);
         sendResponse(res, 200, true, 'Parking location deleted successfully', parking);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async recordVehicleEntry(req: Request, res: Response) {
      try {
         const entryData = req.body;
         const activity = await parkingService.recordVehicleEntry(entryData);
         sendResponse(res, 201, true, 'Vehicle entry recorded successfully', activity);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async recordVehicleExit(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const activity = await parkingService.recordVehicleExit(id);
         sendResponse(res, 200, true, 'Vehicle exit recorded successfully', activity);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async getActivityById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const activity = await parkingService.getActivityById(id);
         sendResponse(res, 200, true, 'Parking activity retrieved successfully', activity);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async getActiveVehicles(_req: Request, res: Response) {
      try {
         const activities = await parkingService.getActiveVehicles();
         sendResponse(res, 200, true, 'Active vehicles retrieved successfully', activities);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async generateEntryTicket(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const ticket = await parkingService.generateEntryTicket(id);
         sendResponse(res, 200, true, 'Entry ticket generated successfully', ticket);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async generateParkingSummary(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const summary = await parkingService.generateParkingSummary(id);
         sendResponse(res, 200, true, 'Parking summary generated successfully', summary);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async getActivitiesByDateRange(req: Request, res: Response) {
      try {
         const { startDate, endDate } = req.query;
         const dateRange = {
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string),
         };
         const activities = await parkingService.getVehicleActivitiesByDateRange(
            dateRange.startDate, 
            dateRange.endDate
         );
         sendResponse(res, 200, true, 'Vehicle activities retrieved successfully', activities);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }

   async getCompletedActivitiesByDateRange(req: Request, res: Response) {
      try {
         const { startDate, endDate } = req.query;
         const dateRange = {
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string),
         };
         const activities = await parkingService.getCompletedActivitiesByDateRange(
            dateRange.startDate, 
            dateRange.endDate
         );
         sendResponse(res, 200, true, 'Completed activities retrieved successfully', activities);
      } catch (error) {
         sendResponse(res, error.statusCode || 500, false, error.message);
      }
   }
}

export default new ParkingController();
