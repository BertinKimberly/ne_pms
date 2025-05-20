import { Router } from "express";
import authRoutes from "./auth.routes";
import parkingRoutes from "./parking.routes";
import vehicleRoutes from "./vehicle.routes";
import usersRoutes from "./user.routes";
import bookingRoutes from "./booking.route";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);
router.use('/users', usersRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/bookings', bookingRoutes);
router.use('/parking', parkingRoutes);

export default router;