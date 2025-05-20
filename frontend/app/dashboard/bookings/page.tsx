"use client";

import React, { useState } from "react";
import { useAuthCheck } from "@/hooks/useAuth";
import {
   useMyBookings,
   BookingStatus,
   canCancelBooking,
   getBookingStatusColor,
} from "@/hooks/useBooking";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
   Calendar,
   Car,
   Clock,
   ParkingSquare,
   MapPin,
   Filter,
} from "lucide-react";
import Link from "next/link";
import { useCancelBooking } from "@/hooks/useBooking";

const BookingsPage = () => {
   const { user } = useAuthCheck();
   const {
      data: bookingsData,
      isLoading: bookingsLoading,
      error,
   } = useMyBookings();
   const { mutate: cancelBooking, isPending: isCancelling } =
      useCancelBooking();
   const [statusFilter, setStatusFilter] = useState<string>("all");

   const bookings = bookingsData?.data || [];

   // Filter bookings based on status
   const filteredBookings =
      statusFilter === "all"
         ? bookings
         : bookings.filter(
              (booking) =>
                 booking.status.toLowerCase() === statusFilter.toLowerCase()
           );

   // Format date for display
   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
         month: "short",
         day: "numeric",
         hour: "numeric",
         minute: "numeric",
      }).format(date);
   };

   if (bookingsLoading) {
      return (
         <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
               My Bookings
            </h1>
            <div className="grid gap-6">
               <Card className="border-none shadow-md">
                  <CardHeader>
                     <Skeleton className="h-6 w-1/3" />
                  </CardHeader>
                  <CardContent>
                     <Skeleton className="h-64 w-full" />
                  </CardContent>
               </Card>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
               My Bookings
            </h1>
            <Card className="border-none shadow-md">
               <CardContent className="text-center py-6 text-red-500">
                  Error loading bookings. Please try again later.
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
            My Bookings, {user?.firstName}!
         </h1>
         <p className="text-gray-500 mb-8">
            View and manage your parking bookings
         </p>

         {/* Status Filter */}
         <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select
               value={statusFilter}
               onValueChange={setStatusFilter}
            >
               <SelectTrigger className="w-full md:w-48 border-blue-200">
                  <Filter className="h-5 w-5 mr-2 text-gray-400" />
                  <SelectValue placeholder="Filter by status" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
               </SelectContent>
            </Select>
         </div>

         {/* Bookings List */}
         <Card className="border-none shadow-md">
            <CardHeader>
               <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  Your Bookings
               </CardTitle>
               <CardDescription>
                  {filteredBookings.length} bookings found
               </CardDescription>
            </CardHeader>
            <CardContent>
               {filteredBookings.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                     No bookings found. Book a parking slot to get started!
                     <div className="mt-4">
                        <Link href="/dashboard/explore">
                           <Button className="bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white">
                              Find Parking
                           </Button>
                        </Link>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                     {filteredBookings.map((booking) => (
                        <div
                           key={booking.id}
                           className="flex items-center justify-between p-4 rounded-lg border bg-white"
                        >
                           <div className="flex items-start space-x-3">
                              <div className="rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 p-2 text-white">
                                 <ParkingSquare className="h-4 w-4" />
                              </div>
                              <div>
                                 <div className="font-medium">
                                    Slot #{booking.parkingSlot.number}
                                 </div>
                                 <div className="text-sm text-gray-500">
                                    {booking.vehicle.plateNumber} •{" "}
                                    {formatDate(booking.startTime)}
                                 </div>
                                 <div className="flex gap-2 mt-1">
                                    <Badge variant="secondary">
                                       {booking.vehicle.type}
                                    </Badge>
                                    <Badge
                                       className={`bg-${getBookingStatusColor(
                                          booking.status
                                       )}-100 text-${getBookingStatusColor(
                                          booking.status
                                       )}-800`}
                                    >
                                       {booking.status}
                                    </Badge>
                                 </div>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <Link href={`/dashboard/bookings/${booking.id}`}>
                                 <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-blue-500 border-blue-200 hover:bg-blue-50"
                                 >
                                    Details
                                 </Button>
                              </Link>
                              {canCancelBooking(booking) && (
                                 <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => cancelBooking(booking.id)}
                                    disabled={isCancelling}
                                    className="bg-red-500 hover:bg-red-600"
                                 >
                                    Cancel
                                 </Button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </CardContent>
         </Card>

         {/* Quick Actions */}
         <Card className="border-none shadow-md bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white mt-8">
            <CardHeader>
               <CardTitle>Quick Actions</CardTitle>
               <CardDescription className="text-white/80">
                  Manage your parking needs
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button
                     variant="secondary"
                     className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  >
                     <Link
                        href="/dashboard/explore"
                        className="flex flex-col items-center gap-2 h-full w-full"
                     >
                        <ParkingSquare className="h-5 w-5" />
                        <span>Book Parking</span>
                     </Link>
                  </Button>
                  <Button
                     variant="secondary"
                     className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  >
                     <Link
                        href="/dashboard/vehicles"
                        className="flex flex-col items-center gap-2 h-full w-full"
                     >
                        <Car className="h-5 w-5" />
                        <span>Manage Vehicles</span>
                     </Link>
                  </Button>
                  <Button
                     variant="secondary"
                     className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  >
                     <Link
                        href="/dashboard/payments"
                        className="flex flex-col items-center gap-2 h-full w-full"
                     >
                        <MapPin className="h-5 w-5" />
                        <span>Payment History</span>
                     </Link>
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

export default BookingsPage;
