//@ts-nocheck
import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../utils/helpers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RoleCheckOptions = {
   /**
    * Allow access if user owns the resource (ID should match req.user.id)
    */
   allowOwner?: boolean;
   /**
    * Custom function to check if user has access
    */
   customCheck?: (req: Request) => Promise<boolean>;
};

/**
 * Enhanced role middleware with additional options
 * @param allowedRoles Array of allowed roles
 * @param options Additional options for access control
 * @returns Middleware function
 */
export const roleMiddleware = (
   allowedRoles: string[],
   options: RoleCheckOptions = {}
) => {
   return async (req: Request, _res: Response, next: NextFunction) => {
      try {
         if (!req.user) {
            throw new ForbiddenError("User not authenticated");
         }

         // Check custom permission function first if provided
         if (options.customCheck) {
            const hasCustomAccess = await options.customCheck(req);
            if (hasCustomAccess) return next();
         }

         // Allow if user has one of the required roles
         if (allowedRoles.includes(req.user.role)) {
            return next();
         }

         // Check if owner access is allowed
         if (options.allowOwner) {
            const resourceId = req.params.id;
            if (!resourceId) {
               throw new ForbiddenError("Resource ID not provided");
            }

            const resource = await prisma.booking.findUnique({
               where: { id: resourceId },
               select: { vehicle: { select: { userId: true } } },
            });

            if (resource?.vehicle.userId === req.user.id) {
               return next();
            }
         }

         throw new ForbiddenError(
            `Access denied. Required roles: ${allowedRoles.join(", ")}` +
               (options.allowOwner ? " or resource ownership" : "")
         );
      } catch (error) {
         next(error);
      }
   };
};

/**
 * Middleware to check if user has permission based on permission string
 * @param requiredPermission Permission string (e.g., 'booking:create')
 * @returns Middleware function
 */
export const permissionMiddleware = (requiredPermission: string) => {
   return async (req: Request, _res: Response, next: NextFunction) => {
      try {
         if (!req.user) {
            throw new ForbiddenError("User not authenticated");
         }

         const userPermissions = await getUserPermissions(req.user.id);

         if (!userPermissions.includes(requiredPermission)) {
            throw new ForbiddenError(
               `Missing required permission: ${requiredPermission}`
            );
         }

         next();
      } catch (error) {
         next(error);
      }
   };
};

// Mock function - replace with actual implementation
async function getUserPermissions(_userId: string): Promise<string[]> {
   return [];
}
