// services/user.service.ts
import { PrismaClient, User, Role } from "@prisma/client";

const prisma = new PrismaClient();

class UserService {
   async getAllUsers(): Promise<Partial<User>[]> {
      return prisma.user.findMany({
         select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            updatedAt: true,
         },
      });
   }

   async getUserById(id: string): Promise<Partial<User> | null> {
      return prisma.user.findUnique({
         where: { id },
         select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            updatedAt: true,
         },
      });
   }

   async updateUserRole(id: string, role: Role): Promise<Partial<User>> {
      return prisma.user.update({
         where: { id },
         data: { role },
         select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            updatedAt: true,
         },
      });
   }

   async deleteUser(id: string): Promise<Partial<User>> {
      return prisma.user.delete({
         where: { id },
         select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
         },
      });
   }
}

export default new UserService();
