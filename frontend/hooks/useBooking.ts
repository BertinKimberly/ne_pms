import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";

// Enums (copied from your schema.prisma but moved here for frontend use)
export enum BookingStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  MOBILE = "MOBILE",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

// Types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  user: User;
}

interface ParkingSlot {
  id: string;
  number: string;
  floor: number;
  isAvailable: boolean;
}

interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

export interface Booking {
  id: string;
  parkingSlot: ParkingSlot;
  vehicle: Vehicle;
  user: User;
  startTime: string;
  endTime?: string;
  status: BookingStatus;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

// API call functions
const fetchMyBookings = () => {
  return handleApiRequest(() => authorizedAPI.get("/bookings/me"));
};

const fetchBookingById = (id: string) => {
  return handleApiRequest(() => authorizedAPI.get(`/bookings/${id}`));
};

const requestCancelBooking = (id: string) => {
  return handleApiRequest(() => authorizedAPI.post(`/bookings/${id}/cancel`));
};

const fetchAllBookings = () => {
  return handleApiRequest(() => authorizedAPI.get("/bookings"));
};

// React Query hooks
export const useMyBookings = () => {
  return useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchMyBookings,
    onError: (error: any) => {
      console.error("Error fetching user bookings:", error);
    },
  });
};

export const useBooking = (id?: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetchBookingById(id!),
    enabled: !!id,
    onError: (error: any) => {
      console.error(`Error fetching booking ${id}:`, error);
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestCancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
    },
    onError: (error: any) => {
      console.error("Error cancelling booking:", error);
    },
  });
};

export const useAllBookings = () => {
  return useQuery({
    queryKey: ["allBookings"],
    queryFn: fetchAllBookings,
    onError: (error: any) => {
      console.error("Error fetching all bookings:", error);
    },
  });
};

// Utility functions
export const canCancelBooking = (booking?: Booking) => {
  return booking?.status === BookingStatus.ACTIVE;
};

export const getBookingStatusColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.ACTIVE:
      return "green";
    case BookingStatus.COMPLETED:
      return "blue";
    case BookingStatus.CANCELLED:
      return "red";
    default:
      return "gray";
  }
};