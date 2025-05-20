"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  useAllBookings, 
  BookingStatus, 
  getBookingStatusColor,
  useCancelBooking 
} from '@/hooks/useBooking';
import { 
  useParkingSlots, 
  getSlotStatus, 
  getSlotStatusColor, 
  useReleaseSlot 
} from '@/hooks/useParking';
import { 
  useMyVehicles, 
  VehicleType, 
  getVehicleTypeLabel, 
  getVehicleTypeColor 
} from '@/hooks/useVehicle';
import { useAuthCheck, useLogoutUser } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  Car, 
  Calendar, 
  LogOut, 
  Layers, 
  Menu, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  RefreshCw,
  User,
  MapPin
} from 'lucide-react';

// Component imports
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const AdminPage = () => {
  // Auth check
  const { isAuthenticated, user, hasRequiredRole } = useAuthCheck('ADMIN');
  const router = useRouter();
  const logoutMutation = useLogoutUser();
  
  // State management
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Data fetching hooks
  const bookingsQuery = useAllBookings();
  const parkingSlotsQuery = useParkingSlots();
  const vehiclesQuery = useMyVehicles();
  const cancelBookingMutation = useCancelBooking();
  const releaseSlotMutation = useReleaseSlot();
  
  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!hasRequiredRole) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, hasRequiredRole, router]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;
    
    try {
      await cancelBookingMutation.mutateAsync(selectedBookingId);
      toast.success('Booking cancelled successfully');
      setShowConfirmDialog(false);
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleReleaseSlot = async () => {
    if (!selectedSlotId) return;
    
    try {
      await releaseSlotMutation.mutateAsync(selectedSlotId);
      toast.success('Parking slot released successfully');
      setShowConfirmDialog(false);
    } catch (error) {
      toast.error('Failed to release parking slot');
    }
  };

  const filteredBookings = bookingsQuery.data?.data?.filter(booking => 
    booking.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.parkingSlot.number.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Loading states
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 flex items-center">
              Admin Dashboard
              <Badge className="ml-3 bg-gradient-to-r from-blue-500 to-indigo-600">
                Admin
              </Badge>
            </h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  bookingsQuery.refetch();
                  parkingSlotsQuery.refetch();
                  vehiclesQuery.refetch();
                  toast.success("Data refreshed");
                }}
                className="p-2 rounded-full hover:bg-blue-50 text-blue-600"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <div className="relative">
                <div className="rounded-full bg-blue-100 p-2">
                  <span className="text-sm font-medium text-blue-600">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-md border-none bg-white/90 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  Active Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsQuery.isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-blue-600">
                      {bookingsQuery.data?.data?.filter(booking => booking.status === BookingStatus.ACTIVE).length || 0}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">bookings</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md border-none bg-white/90 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-500" />
                  Available Parking Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                {parkingSlotsQuery.isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-green-600">
                      {parkingSlotsQuery.data?.data?.filter(slot => slot.isAvailable).length || 0}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">of {parkingSlotsQuery.data?.data?.length || 0} slots</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md border-none bg-white/90 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Car className="h-5 w-5 mr-2 text-indigo-500" />
                  Registered Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehiclesQuery.isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-indigo-600">
                      {vehiclesQuery.data?.data?.length || 0}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">vehicles</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="bookings" className="mb-6">
            <TabsList className="bg-white/70 backdrop-blur-sm border shadow-sm mb-6">
              <TabsTrigger value="bookings" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Bookings Management
              </TabsTrigger>
              <TabsTrigger value="parking" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <MapPin className="h-4 w-4 mr-2" />
                Parking Overview
              </TabsTrigger>
            </TabsList>

            {/* Bookings Tab Content */}
            <TabsContent value="bookings" className="mt-0">
              <Card className="shadow-lg border-none bg-white/90 backdrop-blur-md">
                <CardHeader className="pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <CardTitle>All Bookings</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by plate, name or slot..."
                        className="pl-9 w-64 bg-white/90"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {bookingsQuery.isLoading ? (
                    <div className="space-y-4 py-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Slot</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBookings.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                <div className="flex flex-col items-center">
                                  <Calendar className="h-10 w-10 text-gray-300 mb-2" />
                                  No bookings found
                                  {searchQuery && <p className="text-sm mt-1">Try another search term</p>}
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredBookings.map((booking) => (
                              <TableRow key={booking.id} className="hover:bg-blue-50/50">
                                <TableCell>
                                  <div className="font-medium">{booking.user.firstName} {booking.user.lastName}</div>
                                  <div className="text-sm text-gray-500">{booking.user.email}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Badge 
                                      className={`mr-2 bg-${getVehicleTypeColor(booking.vehicle.type as VehicleType)}-100 text-${getVehicleTypeColor(booking.vehicle.type as VehicleType)}-700 hover:bg-${getVehicleTypeColor(booking.vehicle.type as VehicleType)}-200 border-none`}
                                    >
                                      {getVehicleTypeLabel(booking.vehicle.type as VehicleType)}
                                    </Badge>
                                    {booking.vehicle.plateNumber}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">Slot #{booking.parkingSlot.number}</div>
                                  <div className="text-xs text-gray-500">Floor {booking.parkingSlot.floor}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                    <div>
                                      {new Date(booking.startTime).toLocaleDateString()}
                                      <div className="text-xs text-gray-500">
                                        {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    className={`bg-${getBookingStatusColor(booking.status)}-100 text-${getBookingStatusColor(booking.status)}-700 hover:bg-${getBookingStatusColor(booking.status)}-200 border-none`}
                                  >
                                    {booking.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  {booking.status === BookingStatus.ACTIVE && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                      onClick={() => {
                                        setSelectedBookingId(booking.id);
                                        setShowConfirmDialog(true);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Parking Tab Content */}
            <TabsContent value="parking" className="mt-0">
              <Card className="shadow-lg border-none bg-white/90 backdrop-blur-md">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <CardTitle>Parking Slots Overview</CardTitle>
                    <Select
                      value={selectedFloor.toString()}
                      onValueChange={(value) => setSelectedFloor(parseInt(value))}
                    >
                      <SelectTrigger className="w-40 bg-white">
                        <SelectValue placeholder="Select Floor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Floor</SelectLabel>
                          <SelectItem value="1">Floor 1</SelectItem>
                          <SelectItem value="2">Floor 2</SelectItem>
                          <SelectItem value="3">Floor 3</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <CardDescription>
                    Currently viewing Floor {selectedFloor}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {parkingSlotsQuery.isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {parkingSlotsQuery.data?.data
                        ?.filter(slot => slot.floor === selectedFloor)
                        .map((slot) => (
                          <div 
                            key={slot.id} 
                            className={`p-4 rounded-lg border ${
                              slot.isAvailable 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-lg font-bold">
                                #{slot.number}
                              </span>
                              <Badge 
                                className={`
                                  ${slot.isAvailable 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                  } border-none
                                `}
                              >
                                {getSlotStatus(slot)}
                              </Badge>
                            </div>
                            <div className="text-sm mb-3">
                              Floor {slot.floor}
                            </div>
                            {!slot.isAvailable && slot.vehicleId && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-red-600 border-red-200 hover:bg-red-100"
                                onClick={() => {
                                  setSelectedSlotId(slot.id);
                                  setShowConfirmDialog(true);
                                }}
                              >
                                Release
                              </Button>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Confirm Action
            </DialogTitle>
            <DialogDescription>
              {selectedBookingId ? 
                'Are you sure you want to cancel this booking? This action cannot be undone.' :
                'Are you sure you want to release this parking slot? This action cannot be undone.'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={selectedBookingId ? handleCancelBooking : handleReleaseSlot}
              disabled={cancelBookingMutation.isPending || releaseSlotMutation.isPending}
            >
              {(cancelBookingMutation.isPending || releaseSlotMutation.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;