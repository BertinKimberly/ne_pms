import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";

// Enums (copied from your schema.prisma but moved here for frontend use)
export enum VehicleType {
   CAR = "CAR",
   MOTORCYCLE = "MOTORCYCLE",
   TRUCK = "TRUCK",
   VAN = "VAN",
}

// Types
export interface Vehicle {
   id: string;
   plateNumber: string;
   type: VehicleType;
   userId: string;
   createdAt: string;
   updatedAt: string;
}

export interface CreateVehicleDto {
   plateNumber: string;
   type: VehicleType;
}

export interface UpdateVehicleDto {
   plateNumber: string;
   type: VehicleType;
}

// API call functions
const fetchMyVehicles = () => {
   return handleApiRequest(() => authorizedAPI.get("/vehicles/me"));
};

const fetchVehicleById = (id: string) => {
   return handleApiRequest(() => authorizedAPI.get(`/vehicles/${id}`));
};

const createNewVehicle = (vehicleData: CreateVehicleDto) => {
   return handleApiRequest(() => authorizedAPI.post("/vehicles", vehicleData));
};

const updateExistingVehicle = (id: string, vehicleData: UpdateVehicleDto) => {
   return handleApiRequest(() =>
      authorizedAPI.put(`/vehicles/${id}`, vehicleData)
   );
};

const deleteExistingVehicle = (id: string) => {
   return handleApiRequest(() => authorizedAPI.delete(`/vehicles/${id}`));
};

// React Query hooks
export const useMyVehicles = () => {
   return useQuery({
      queryKey: ["myVehicles"],
      queryFn: fetchMyVehicles,
      onError: (error: any) => {
         console.error("Error fetching user vehicles:", error);
      },
      select: (data) => {
         if (Array.isArray(data) && data.length === 0) {
            return { success: true, data: [] };
         }
         return data;
      }
   });
};

export const useVehicle = (id?: string) => {
   return useQuery({
      queryKey: ["vehicle", id],
      queryFn: () => fetchVehicleById(id!),
      enabled: !!id,
      onError: (error: any) => {
         console.error(`Error fetching vehicle ${id}:`, error);
      },
   });
};

export const useCreateVehicle = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: createNewVehicle,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["myVehicles"] });
      },
      onError: (error: any) => {
         console.error("Error creating vehicle:", error);
      },
   });
};

export const useUpdateVehicle = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ id, ...data }: { id: string } & UpdateVehicleDto) =>
         updateExistingVehicle(id, data),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["myVehicles"] });
         queryClient.invalidateQueries({ queryKey: ["vehicle", variables.id] });
      },
      onError: (error: any) => {
         console.error("Error updating vehicle:", error);
      },
   });
};

export const useDeleteVehicle = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteExistingVehicle,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["myVehicles"] });
         queryClient.invalidateQueries({ queryKey: ["vehicle", variables] });
      },
      onError: (error: any) => {
         console.error("Error deleting vehicle:", error);
      },
   });
};

// Utility functions
export const getVehicleTypeLabel = (type: VehicleType) => {
   switch (type) {
      case VehicleType.CAR:
         return "Car";
      case VehicleType.MOTORCYCLE:
         return "Motorcycle";
      case VehicleType.TRUCK:
         return "Truck";
      case VehicleType.VAN:
         return "Van";
      default:
         return "Unknown";
   }
};

export const getVehicleTypeColor = (type: VehicleType) => {
   switch (type) {
      case VehicleType.CAR:
         return "blue";
      case VehicleType.MOTORCYCLE:
         return "green";
      case VehicleType.TRUCK:
         return "orange";
      case VehicleType.VAN:
         return "purple";
      default:
         return "gray";
   }
};
