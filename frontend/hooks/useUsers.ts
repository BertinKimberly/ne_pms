import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { toast } from "sonner";

// Enums (based on Prisma schema for Role)
export enum Role {
   USER = "USER",
   ADMIN = "ADMIN",
}

// Types
export interface User {
   id: string;
   email: string;
   firstName: string | null;
   lastName: string | null;
   role: Role;
   createdAt: string;
   updatedAt: string;
}

export interface CreateUserDto {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   role: string;
}

export interface UpdateRoleDto {
   role: string;
}

// API call functions
const fetchAllUsers = () => {
   return handleApiRequest(() => authorizedAPI.get("/users"));
};

const fetchUserById = (id: string) => {
   return handleApiRequest(() => authorizedAPI.get(`/users/${id}`));
};

const updateUserRole = (id: string, data: UpdateRoleDto) => {
   return handleApiRequest(() => authorizedAPI.patch(`/users/${id}/role`, data));
};

const deleteUser = (id: string) => {
   return handleApiRequest(() => authorizedAPI.delete(`/users/${id}`));
};

// React Query hooks
export const useAllUsers = () => {
   return useQuery({
      queryKey: ["users"],
      queryFn: fetchAllUsers,
      onError: (error: any) => {
         console.error("Error fetching users:", error);
      },
   });
};

export const useUser = (id?: string) => {
   return useQuery({
      queryKey: ["user", id],
      queryFn: () => fetchUserById(id!),
      enabled: !!id,
      onError: (error: any) => {
         console.error(`Error fetching user ${id}:`, error);
      },
   });
};

export const useUpdateUserRole = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ id, role }: { id: string; role: string }) =>
         updateUserRole(id, { role }),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["users"] });
         queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
         toast.success("User role updated successfully");
      },
      onError: (error: any) => {
         console.error("Error updating user role:", error);
         toast.error(error?.message || "Failed to update user role");
      },
   });
};

export const useDeleteUser = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteUser,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["users"] });
         toast.success("User deleted successfully");
      },
      onError: (error: any) => {
         console.error("Error deleting user:", error);
         toast.error(error?.message || "Failed to delete user");
      },
   });
};

// Utility functions
export const getRoleLabel = (role: Role) => {
   switch (role) {
      case Role.USER:
         return "User";
      case Role.ADMIN:
         return "Admin";
      default:
         return "Unknown";
   }
};

export const getRoleColor = (role: Role) => {
   switch (role) {
      case Role.USER:
         return "blue";
      case Role.ADMIN:
         return "red";
      default:
         return "gray";
   }
};