import { Router } from "express";
import userController from "../controllers/user.controller";
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get(
   "/",
   authenticate,
   authorize(Role.ADMIN),
   userController.getAllUsers
);
router.get(
   "/:id",
   authenticate,
   authorize(Role.ADMIN),
   userController.getUserById
);
router.patch(
   "/:id/role",
   authenticate,
   authorize(Role.ADMIN),
   userController.updateUserRole
);
router.delete(
   "/:id",
   authenticate,
   authorize(Role.ADMIN),
   userController.deleteUser
);

export { router as UsersRouter };
