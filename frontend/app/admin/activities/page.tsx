"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthCheck } from '@/hooks/useAuth';
import { useAllUsers } from '@/hooks/useUsers';
import { useMyVehicles } from '@/hooks/useVehicle';
import { useParkingLocations } from '@/hooks/useParkingLocations';
import { 
  useActiveVehicles, 
  useRecordVehicleEntry, 
  useRecordVehicleExit, 
  ParkingEntryDto 
} from '@/hooks/useVehicleActivities';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  LogIn, 
  LogOut, 
  Clock, 
  MapPin, 
  User, 
  Search,
  Ticket,
  Receipt,
  Loader2,
  Calendar,
  BanknoteIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ActivitiesPage = () => {
  const router = useRouter();
  const { isAuthenticated, hasRequiredRole, user } = useAuthCheck('ADMIN');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEntryDialog, setShowEntryDialog] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedParkingId, setSelectedParkingId] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);

  // Fetch data
  const { data: activeVehiclesData, isLoading: loadingActivities } = useActiveVehicles();
  const { data: vehiclesData, isLoading: loadingVehicles } = useMyVehicles();
  const { data: parkingsData, isLoading: loadingParkings } = useParkingLocations();
  const { data: usersData, isLoading: loadingUsers } = useAllUsers();
  
  // Mutations
  const recordEntryMutation = useRecordVehicleEntry();
  const recordExitMutation = useRecordVehicleExit();

  // Redirect if not authenticated or not admin/attendant
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!hasRequiredRole && user?.role !== 'ATTENDANT') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, hasRequiredRole, router, user]);

  // Filter active vehicles based on search query
  const filteredActivities = (activeVehiclesData?.data || []).filter(activity => 
    activity.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.parking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.parking.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecordEntry = async () => {
    if (!selectedVehicleId || !selectedParkingId) {
      toast.error('Please select a vehicle and parking location');
      return;
    }

    try {
      const entryData: ParkingEntryDto = {
        vehicleId: selectedVehicleId,
        parkingId: selectedParkingId,
        userId: user?.id || '',
      };
      
      await recordEntryMutation.mutateAsync(entryData);
      setShowEntryDialog(false);
      setSelectedVehicleId('');
      setSelectedParkingId('');
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleRecordExit = async (activityId: string) => {
    try {
      await recordExitMutation.mutateAsync(activityId);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  // Formatted time elapsed
  const getTimeElapsed = (entryTime: string) => {
    const entry = new Date(entryTime);
    const now = new Date();
    const diffMs = now.getTime() - entry.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    if (diffHrs < 1) {
      return `${Math.round(diffHrs * 60)} minutes`;
    }
    
    return `${diffHrs.toFixed(1)} hours`;
  };

  if (!isAuthenticated || (!hasRequiredRole && user?.role !== 'ATTENDANT')) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-500" />
            Parking Activities
          </h1>
          <p className="text-gray-500 text-sm">
            Manage vehicle entries and exits
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by plate, ticket..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={showEntryDialog} onOpenChange={setShowEntryDialog}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 bg-blue-600 hover:bg-blue-700">
                <LogIn className="h-4 w-4" />
                Record Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record Vehicle Entry</DialogTitle>
                <DialogDescription>
                  Select the vehicle and parking location. Click record when done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Select 
                    value={selectedVehicleId} 
                    onValueChange={setSelectedVehicleId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingVehicles ? (
                        <div className="flex justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : vehiclesData?.data?.length === 0 ? (
                        <div className="p-2 text-center text-sm text-gray-500">
                          No vehicles found
                        </div>
                      ) : (
                        vehiclesData?.data?.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.plateNumber} ({vehicle.type})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parking">Parking Location</Label>
                  <Select 
                    value={selectedParkingId} 
                    onValueChange={setSelectedParkingId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parking location" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingParkings ? (
                        <div className="flex justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : parkingsData?.data?.length === 0 ? (
                        <div className="p-2 text-center text-sm text-gray-500">
                          No parking locations found
                        </div>
                      ) : (
                        parkingsData?.data?.map(parking => (
                          <SelectItem key={parking.id} value={parking.id}>
                            {parking.name} ({parking.availableSpaces}/{parking.totalSpaces})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEntryDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleRecordEntry} 
                  disabled={recordEntryMutation.isPending || !selectedVehicleId || !selectedParkingId}
                >
                  {recordEntryMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    'Record Entry'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Active Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingActivities ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            ) : (
              <div className="text-2xl font-bold">{activeVehiclesData?.data?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Available Spaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingParkings ? (
              <Loader2 className="h-5 w-5 animate-spin text-green-500" />
            ) : (
              <div className="text-2xl font-bold">
                {parkingsData?.data?.reduce((sum, parking) => sum + parking.availableSpaces, 0) || 0}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-600">
              Total Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingParkings ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            ) : (
              <div className="text-2xl font-bold">
                {parkingsData?.data?.reduce((sum, parking) => sum + parking.totalSpaces, 0) || 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Currently Parked Vehicles</CardTitle>
          <CardDescription>
            Vehicles currently in parking locations. Record exit when they leave.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingActivities ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {searchQuery ? (
                <p>No vehicles found matching "{searchQuery}"</p>
              ) : (
                <p>No vehicles currently parked</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredActivities.map(activity => (
                <Card key={activity.id} className="overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-blue-100">Ticket #{activity.ticketNumber}</p>
                        <CardTitle className="text-lg flex items-center gap-2 mt-1">
                          <Car className="h-5 w-5" />
                          {activity.vehicle.plateNumber}
                        </CardTitle>
                      </div>
                      <Badge className="bg-white/20 hover:bg-white/30 text-white">
                        {activity.vehicle.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Entry Time
                        </span>
                        <span className="font-medium">
                          {format(new Date(activity.entryDateTime), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Duration
                        </span>
                        <span className="font-medium">
                          {getTimeElapsed(activity.entryDateTime)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Location
                        </span>
                        <span className="font-medium">
                          {activity.parking.name}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 flex items-center gap-1">
                          <BanknoteIcon className="h-3 w-3" /> Fee/Hour
                        </span>
                        <span className="font-medium">
                          {activity.parking.feePerHour.toLocaleString()} RWF
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedActivityId(activity.id);
                        setShowTicketDialog(true);
                      }}
                    >
                      <Ticket className="h-4 w-4 mr-1" />
                      Ticket
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedActivityId(activity.id);
                        setShowSummaryDialog(true);
                      }}
                    >
                      <Receipt className="h-4 w-4 mr-1" />
                      Bill
                    </Button>
                    <Button 
                      variant="default"
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleRecordExit(activity.id)}
                      disabled={recordExitMutation.isPending}
                    >
                      {recordExitMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <LogOut className="h-4 w-4 mr-1" />
                          Exit
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket/Bill Dialogs would be implemented here */}
      {/* These would show entry ticket or parking bill based on selectedActivityId */}
    </div>
  );
};

export default ActivitiesPage; 