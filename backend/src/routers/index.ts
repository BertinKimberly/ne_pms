import { Router } from "express";
import authRoutes from "./auth.routes";
import parkingRoutes from "./parking.routes";
import vehicleRoutes from "./vehicle.routes";
import { UsersRouter } from "./user.routes";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/parking", parkingRoutes);
router.use('/users', UsersRouter);
router.use('/vehicles', vehicleRoutes);

export default router;