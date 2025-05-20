import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { toast } from "sonner";

// Types
export interface ParkingActivity {
  id: string;
  ticketNumber: string;
  entryDateTime: string;
  exitDateTime?: string;
  duration?: number;
  status: 'ACTIVE' | 'COMPLETED';
  vehicle: {
    id: string;
    plateNumber: string;
    type: string;
  };
  parking: {
    id: string;
    code: string;
    name: string;
    location: string;
    feePerHour: number;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ParkingEntryDto {
  vehicleId: string;
  parkingId: string;
  userId: string;
}

export interface EntryTicket {
  ticketNumber: string;
  plateNumber: string;
  vehicleType: string;
  entryDateTime: string;
  parkingName: string;
  parkingCode: string;
  location: string;
  feePerHour: number;
}

export interface ParkingSummary {
  ticketNumber: string;
  plateNumber: string;
  vehicleType: string;
  entryDateTime: string;
  exitDateTime?: string;
  estimatedExitDateTime?: string;
  parkingName: string;
  parkingCode: string;
  duration?: string;
  estimatedDuration?: string;
  feePerHour: number;
  isEstimate: boolean;
}

// API call functions
const fetchActiveVehicles = () => {
  return handleApiRequest(() => authorizedAPI.get("/parking/activities/active"));
};

const fetchActivityById = (id: string) => {
  return handleApiRequest(() => authorizedAPI.get(`/parking/activities/${id}`));
};

const recordVehicleEntry = (data: ParkingEntryDto) => {
  return handleApiRequest(() => authorizedAPI.post("/parking/activities/entry", data));
};

const recordVehicleExit = (id: string) => {
  return handleApiRequest(() => authorizedAPI.post(`/parking/activities/${id}/exit`));
};

const generateEntryTicket = (id: string) => {
  return handleApiRequest(() => authorizedAPI.get(`/parking/activities/${id}/ticket`));
};

const generateParkingSummary = (id: string) => {
  return handleApiRequest(() => authorizedAPI.get(`/parking/activities/${id}/summary`));
};

// React Query hooks
export const useActiveVehicles = () => {
  return useQuery({
    queryKey: ["activeVehicles"],
    queryFn: fetchActiveVehicles,
    refetchInterval: 30000, // Refetch every 30 seconds
    onError: (error: any) => {
      console.error("Error fetching active vehicles:", error);
    },
  });
};

export const useActivity = (id?: string) => {
  return useQuery({
    queryKey: ["activity", id],
    queryFn: () => fetchActivityById(id!),
    enabled: !!id,
    onError: (error: any) => {
      console.error(`Error fetching activity ${id}:`, error);
    },
  });
};

export const useRecordVehicleEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordVehicleEntry,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["activeVehicles"] });
      queryClient.invalidateQueries({ queryKey: ["parkingLocations"] });
      toast.success("Vehicle entry recorded successfully");
      return data;
    },
    onError: (error: any) => {
      console.error("Error recording vehicle entry:", error);
      toast.error(error?.message || "Failed to record vehicle entry");
    },
  });
};

export const useRecordVehicleExit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordVehicleExit,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["activeVehicles"] });
      queryClient.invalidateQueries({ queryKey: ["parkingLocations"] });
      toast.success("Vehicle exit recorded successfully");
      return data;
    },
    onError: (error: any) => {
      console.error("Error recording vehicle exit:", error);
      toast.error(error?.message || "Failed to record vehicle exit");
    },
  });
};

export const useEntryTicket = (id?: string) => {
  return useQuery({
    queryKey: ["entryTicket", id],
    queryFn: () => generateEntryTicket(id!),
    enabled: !!id,
    onError: (error: any) => {
      console.error(`Error generating entry ticket for activity ${id}:`, error);
    },
  });
};

export const useParkingSummary = (id?: string) => {
  return useQuery({
    queryKey: ["parkingSummary", id],
    queryFn: () => generateParkingSummary(id!),
    enabled: !!id,
    onError: (error: any) => {
      console.error(`Error generating parking summary for activity ${id}:`, error);
    },
  });
}; 