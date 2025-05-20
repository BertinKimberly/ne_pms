"use client";

import React, { useState } from 'react';
import { useAuthCheck } from '@/hooks/useAuth';
import { useMyBookings, BookingStatus } from '@/hooks/useBooking';
import { useMyVehicles } from '@/hooks/useVehicle';
import { useMyPayments, PaymentStatus } from '@/hooks/usePayment';
import { useAvailableSlots } from '@/hooks/useParking';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Car, Clock, CreditCard, DollarSign, ParkingSquare, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const slotStatusColors = ['#3b82f6', '#6366f1', '#8b5cf6'];

const DashboardPage = () => {
  const { user } = useAuthCheck();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: bookingsData, isLoading: bookingsLoading } = useMyBookings();
  const { data: vehiclesData, isLoading: vehiclesLoading } = useMyVehicles();
  const { data: paymentsData, isLoading: paymentsLoading } = useMyPayments();
  const { data: availableSlotsData, isLoading: slotsLoading } = useAvailableSlots();
  
  const bookings = bookingsData?.data || [];
  const vehicles = vehiclesData?.data || [];
  const payments = paymentsData?.data || [];
  const availableSlots = availableSlotsData?.data || [];
  
  // Calculate active bookings
  const activeBookings = bookings.filter(
    (booking) => booking.status === BookingStatus.ACTIVE
  ).length;
  
  // Payment stats
  const totalSpent = payments.reduce((sum, payment) => {
    if (payment.status === PaymentStatus.COMPLETED) {
      return sum + payment.amount;
    }
    return sum;
  }, 0);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Mock data for charts
  const getWeeklyActivityData = () => {
    return [
      { name: 'Mon', bookings: 4, payments: 3 },
      { name: 'Tue', bookings: 3, payments: 2 },
      { name: 'Wed', bookings: 5, payments: 4 },
      { name: 'Thu', bookings: 2, payments: 2 },
      { name: 'Fri', bookings: 6, payments: 5 },
      { name: 'Sat', bookings: 8, payments: 7 },
      { name: 'Sun', bookings: 4, payments: 3 },
    ];
  };

  const getVehicleTypeData = () => {
    const vehicleTypeCount = {};
    vehicles.forEach(vehicle => {
      if (vehicleTypeCount[vehicle.type]) {
        vehicleTypeCount[vehicle.type]++;
      } else {
        vehicleTypeCount[vehicle.type] = 1;
      }
    });
    
    return Object.keys(vehicleTypeCount).map(type => ({
      name: type,
      value: vehicleTypeCount[type]
    }));
  };
  
  const getBookingStatusData = () => {
    const statusCount = {};
    bookings.forEach(booking => {
      if (statusCount[booking.status]) {
        statusCount[booking.status]++;
      } else {
        statusCount[booking.status] = 1;
      }
    });
    
    return Object.keys(statusCount).map(status => ({
      name: status,
      value: statusCount[status]
    }));
  };

  const getPaymentMethodData = () => {
    const methodCount = {};
    payments.forEach(payment => {
      if (methodCount[payment.method]) {
        methodCount[payment.method]++;
      } else {
        methodCount[payment.method] = 1;
      }
    });
    
    return Object.keys(methodCount).map(method => ({
      name: method,
      value: methodCount[method]
    }));
  };

  // Colors for pie charts
  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];

  if (bookingsLoading || vehiclesLoading || paymentsLoading || slotsLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 bg-clip-text text-transparent">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-none shadow-md">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <Card className="border-none shadow-md">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
        Welcome back, {user?.firstName}!
      </h1>
      <p className="text-gray-500 mb-8">Here's a summary of your parking management</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-400/10 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white">Activity</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {/* Stats cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium">Vehicles</CardTitle>
                  <Car className="h-5 w-5 opacity-70" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{vehicles.length}</div>
                <Progress value={vehicles.length > 0 ? 100 : 0} className="h-1 mt-2" />
                <div className="text-xs text-gray-500 mt-2">
                  {vehicles.length > 0 
                    ? `${vehicles.length} registered vehicles` 
                    : "No vehicles registered yet"}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/dashboard/vehicles">
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700 p-0">
                    Manage vehicles
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium">Active Bookings</CardTitle>
                  <Clock className="h-5 w-5 opacity-70" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{activeBookings}</div>
                <Progress 
                  value={activeBookings > 0 ? (activeBookings / (bookings.length || 1)) * 100 : 0} 
                  className="h-1 mt-2" 
                />
                <div className="text-xs text-gray-500 mt-2">
                  {activeBookings === 0 
                    ? "No active bookings" 
                    : `${activeBookings} of ${bookings.length} bookings active`}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/dashboard/bookings">
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700 p-0">
                    View bookings
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium">Available Slots</CardTitle>
                  <ParkingSquare className="h-5 w-5 opacity-70" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{availableSlots.length}</div>
                <Progress value={75} className="h-1 mt-2" />
                <div className="text-xs text-gray-500 mt-2">
                  {availableSlots.length} slots ready to book
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/dashboard/explore">
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700 p-0">
                    Find parking
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium">Total Spent</CardTitle>
                  <DollarSign className="h-5 w-5 opacity-70" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">${totalSpent.toFixed(2)}</div>
                <Progress value={payments.length > 0 ? 100 : 0} className="h-1 mt-2" />
                <div className="text-xs text-gray-500 mt-2">
                  From {payments.length} payments
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/dashboard/payments">
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700 p-0">
                    View history
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Recent bookings and payment activity */}
          <div className="grid gap-6 mt-6 md:grid-cols-2">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <CardDescription>Your latest parking activities</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No booking history yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 4).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-start space-x-3">
                          <div className="rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 p-2 text-white">
                            <Car className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">Slot #{booking.parkingSlot.number}</div>
                            <div className="text-xs text-gray-500">
                              {booking.vehicle.plateNumber} • {formatDate(booking.startTime)}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className={`
                            ${booking.status === BookingStatus.ACTIVE ? 'bg-green-100 text-green-800' : ''}
                            ${booking.status === BookingStatus.COMPLETED ? 'bg-blue-100 text-blue-800' : ''}
                            ${booking.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-800' : ''}
                          `}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/bookings" className="w-full">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-500 hover:bg-blue-50">
                    View all bookings
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">Payment Activity</CardTitle>
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <CardDescription>Your recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No payment history yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.slice(0, 4).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-start space-x-3">
                          <div className="rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 p-2 text-white">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">${payment.amount.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">
                              {payment.method} • {formatDate(payment.createdAt)}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className={`
                            ${payment.status === PaymentStatus.COMPLETED ? 'bg-green-100 text-green-800' : ''}
                            ${payment.status === PaymentStatus.PENDING ? 'bg-orange-100 text-orange-800' : ''}
                            ${payment.status === PaymentStatus.FAILED ? 'bg-red-100 text-red-800' : ''}
                            ${payment.status === PaymentStatus.REFUNDED ? 'bg-blue-100 text-blue-800' : ''}
                          `}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/payments" className="w-full">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-500 hover:bg-blue-50">
                    View all payments
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your bookings and payments this week</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getWeeklyActivityData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="bookings" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBookings)" />
                    <Area type="monotone" dataKey="payments" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPayments)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Your schedule for the next days</CardDescription>
              </CardHeader>
              <CardContent>
                {activeBookings === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-2">No upcoming bookings</p>
                    <Link href="/dashboard/explore">
                      <Button 
                        className="bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white"
                      >
                        Book a parking slot
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings
                      .filter((booking) => booking.status === BookingStatus.ACTIVE)
                      .slice(0, 3)
                      .map((booking) => (
                        <div key={booking.id} className="flex bg-blue-50 rounded-lg p-4">
                          <div className="mr-4 flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 flex items-center justify-center text-white font-medium">
                              {booking.parkingSlot.number}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">{booking.vehicle.plateNumber}</div>
                            <div className="text-sm text-gray-500">
                              Started: {formatDate(booking.startTime)}
                            </div>
                            <div className="mt-2 flex gap-2">
                              <Link href={`/dashboard/bookings/${booking.id}`}>
                                <Button size="sm" variant="outline" className="text-xs">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
                <CardDescription>Overview of your booking statuses</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {bookings.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No booking data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getBookingStatusData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getBookingStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Payment Method Preference</CardTitle>
                <CardDescription>How you prefer to pay</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {payments.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No payment data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getPaymentMethodData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Count" barSize={60}>
                        {getPaymentMethodData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick actions */}
      <Card className="border-none shadow-md bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription className="text-white/80">
            Common tasks at your fingertips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Link href="/dashboard/explore" className="flex flex-col items-center gap-2 h-full w-full">
                <ParkingSquare className="h-5 w-5" />
                <span>Book Parking</span>
              </Link>
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Link href="/dashboard/vehicles/new" className="flex flex-col items-center gap-2 h-full w-full">
                <Car className="h-5 w-5" />
                <span>Add Vehicle</span>
              </Link>
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Link href="/dashboard/bookings" className="flex flex-col items-center gap-2 h-full w-full">
                <Clock className="h-5 w-5" />
                <span>View Bookings</span>
              </Link>
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Link href="/dashboard/payments" className="flex flex-col items-center gap-2 h-full w-full">
                <CreditCard className="h-5 w-5" />
                <span>Payment History</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;