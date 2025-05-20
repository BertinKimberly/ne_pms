import { Request, Response } from "express";
import userService from "../services/user.service";
import { BadRequestError } from "../utils/helpers";

class UserController {
   async getAllUsers(_req: Request, res: Response) {
      try {
         const users = await userService.getAllUsers();
         res.json(users);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async getUserById(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const user = await userService.getUserById(id);
         if (!user) {
            throw new BadRequestError("User not found");
         }
         res.json(user);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async updateUserRole(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const { role } = req.body;
         const user = await userService.updateUserRole(id, role);
         res.json(user);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }

   async deleteUser(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const user = await userService.deleteUser(id);
         res.json(user);
      } catch (error) {
         res.status(error.statusCode || 500).json({ message: error.message });
      }
   }
}

export default new UserController();
