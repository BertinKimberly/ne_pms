import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI, unauthorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { toast } from "sonner";

// Types
export interface ParkingLocation {
  id: string;
  code: string;
  name: string;
  location: string;
  totalSpaces: number;
  availableSpaces: number;
  feePerHour: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateParkingLocationDto {
  code: string;
  name: string;
  location: string;
  totalSpaces: number;
}

// API call functions
const fetchParkingLocations = () => {
  return handleApiRequest(() => unauthorizedAPI.get("/parking"));
};

const fetchParkingLocationById = (id: string) => {
  return handleApiRequest(() => unauthorizedAPI.get(`/parking/locations/${id}`));
};

const fetchParkingLocationByCode = (code: string) => {
  return handleApiRequest(() => unauthorizedAPI.get(`/parking/locations/code/${code}`));
};

const createParkingLocation = (data: CreateParkingLocationDto) => {
  return handleApiRequest(() => authorizedAPI.post("/parking/locations", data));
};

const updateParkingLocation = (id: string, data: CreateParkingLocationDto) => {
  return handleApiRequest(() => authorizedAPI.put(`/parking/locations/${id}`, data));
};

const deleteParkingLocation = (id: string) => {
  return handleApiRequest(() => authorizedAPI.delete(`/parking/locations/${id}`));
};

// Report API calls
const fetchActivitiesByDateRange = (startDate: string, endDate: string) => {
  return handleApiRequest(() => 
    authorizedAPI.get("/parking/reports/entries", {
      params: { startDate, endDate }
    })
  );
};

const fetchCompletedActivitiesByDateRange = (startDate: string, endDate: string) => {
  return handleApiRequest(() => 
    authorizedAPI.get("/parking/reports/exits", {
      params: { startDate, endDate }
    })
  );
};

// React Query hooks
export const useParkingLocations = () => {
  return useQuery({
    queryKey: ["parkingLocations"],
    queryFn: fetchParkingLocations,
    onError: (error: any) => {
      console.error("Error fetching parking locations:", error);
    },
  });
};

export const useParkingLocation = (id?: string) => {
  return useQuery({
    queryKey: ["parkingLocation", id],
    queryFn: () => fetchParkingLocationById(id!),
    enabled: !!id,
    onError: (error: any) => {
      console.error(`Error fetching parking location ${id}:`, error);
    },
  });
};

export const useParkingLocationByCode = (code?: string) => {
  return useQuery({
    queryKey: ["parkingLocationByCode", code],
    queryFn: () => fetchParkingLocationByCode(code!),
    enabled: !!code,
    onError: (error: any) => {
      console.error(`Error fetching parking location with code ${code}:`, error);
    },
  });
};

export const useCreateParkingLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createParkingLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkingLocations"] });
      toast.success("Parking location created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating parking location:", error);
      toast.error(error?.message || "Failed to create parking location");
    },
  });
};

export const useUpdateParkingLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & CreateParkingLocationDto) =>
      updateParkingLocation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["parkingLocations"] });
      queryClient.invalidateQueries({ queryKey: ["parkingLocation", variables.id] });
      toast.success("Parking location updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating parking location:", error);
      toast.error(error?.message || "Failed to update parking location");
    },
  });
};

export const useDeleteParkingLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteParkingLocation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["parkingLocations"] });
      toast.success("Parking location deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting parking location:", error);
      toast.error(error?.message || "Failed to delete parking location");
    },
  });
};

// Report hooks
export const useActivitiesReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["activitiesReport", startDate, endDate],
    queryFn: () => fetchActivitiesByDateRange(startDate!, endDate!),
    enabled: !!startDate && !!endDate,
    onError: (error: any) => {
      console.error("Error fetching activities report:", error);
    },
  });
};

export const useCompletedActivitiesReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["completedActivitiesReport", startDate, endDate],
    queryFn: () => fetchCompletedActivitiesByDateRange(startDate!, endDate!),
    enabled: !!startDate && !!endDate,
    onError: (error: any) => {
      console.error("Error fetching completed activities report:", error);
    },
  });
}; 