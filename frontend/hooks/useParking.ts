import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI, unauthorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";

// Types
export interface ParkingSlot {
  id: string;
  number: string;
  floor: number;
  isAvailable: boolean;
  vehicleId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  parkingSlotId: string;
  vehicleId: string;
  startTime: string;
}

export interface ExtendBookingDto {
  bookingId: string;
  additionalHours: number;
}

// API call functions
const fetchAllParkingSlots = () => {
  return handleApiRequest(() => 
    unauthorizedAPI.get("/parking/slots")
  );
};

const fetchAvailableSlots = (vehicleType?: string) => {
  return handleApiRequest(() => 
    unauthorizedAPI.get("/parking/slots/available", { 
      params: { vehicleType } 
    })
  );
};

const bookParkingSlot = (bookingData: CreateBookingDto) => {
  return handleApiRequest(() => 
    authorizedAPI.post("/parking/book", bookingData)
  );
};

const extendParkingBooking = (extendData: ExtendBookingDto) => {
  return handleApiRequest(() => 
    authorizedAPI.post("/parking/extend", extendData)
  );
};

const releaseParkingSlot = (bookingId: string) => {
  return handleApiRequest(() => 
    authorizedAPI.post(`/parking/release/${bookingId}`)
  );
};

// React Query hooks
export const useParkingSlots = () => {
  return useQuery({
    queryKey: ["parkingSlots"],
    queryFn: fetchAllParkingSlots,
    onError: (error: any) => {
      console.error("Error fetching parking slots:", error);
    },
  });
};

export const useAvailableSlots = (vehicleType?: string) => {
  return useQuery({
    queryKey: ["availableSlots", vehicleType],
    queryFn: () => fetchAvailableSlots(vehicleType),
    onError: (error: any) => {
      console.error("Error fetching available slots:", error);
    },
  });
};

export const useBookSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookParkingSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkingSlots"] });
      queryClient.invalidateQueries({ queryKey: ["availableSlots"] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (error: any) => {
      console.error("Error booking slot:", error);
    },
  });
};

export const useExtendBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: extendParkingBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (error: any) => {
      console.error("Error extending booking:", error);
    },
  });
};

export const useReleaseSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: releaseParkingSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkingSlots"] });
      queryClient.invalidateQueries({ queryKey: ["availableSlots"] });
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
    },
    onError: (error: any) => {
      console.error("Error releasing slot:", error);
    },
  });
};

// Utility functions
export const getSlotStatus = (slot: ParkingSlot) => {
  return slot.isAvailable ? "Available" : "Occupied";
};

export const getSlotStatusColor = (slot: ParkingSlot) => {
  return slot.isAvailable ? "green" : "red";
};

export const filterSlotsByFloor = (slots: ParkingSlot[], floor: number) => {
  return slots.filter(slot => slot.floor === floor);
};