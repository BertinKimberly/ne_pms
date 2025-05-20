
import { Router } from 'express';
import vehicleController from '../controllers/vehicle.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// User routes
router.get('/user', authenticate, vehicleController.getMyVehicles);

// General routes
router.get('/:id', authenticate, vehicleController.getVehicleById);
router.post('/', authenticate, vehicleController.createVehicle);
router.put('/:id', authenticate, vehicleController.updateVehicle);
router.delete('/:id', authenticate, vehicleController.deleteVehicle);

export default router;