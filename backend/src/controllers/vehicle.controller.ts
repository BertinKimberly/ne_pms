// @ts-nocheck
import { Request, Response } from "express";
import vehicleService from "../services/vehicle.service";
import { BadRequestError } from "../utils/helpers";

class VehicleController {
   async createVehicle(req: Request, res: Response) {
      try {
         if (!req.user) {
            throw new BadRequestError("User not authenticated");
         }
         const { plateNumber, type } = req.body;
         const vehicle = await vehicleService.createVehicle(
            plateNumber,
            type,
            req.user.id
         );
         res.status(201).json(vehicle);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getMyVehicles(req: Request, res: Response) {
      try {
         if (!req.user) {
            throw new BadRequestError("User not authenticated");
         }
         const vehicles = await vehicleService.getVehiclesByUser(req.user.id);
         res.json(vehicles);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getVehicleById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const vehicle = await vehicleService.getVehicleById(id);
         if (!vehicle) {
            throw new BadRequestError("Vehicle not found");
         }
         res.json(vehicle);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async updateVehicle(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const { plateNumber, type } = req.body;
         const vehicle = await vehicleService.updateVehicle(
            id,
            plateNumber,
            type
         );
         res.json(vehicle);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async deleteVehicle(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const vehicle = await vehicleService.deleteVehicle(id);
         res.json(vehicle);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }
}

export default new VehicleController();
