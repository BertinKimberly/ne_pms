"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuthCheck } from '@/hooks/useAuth';
import { useAvailableSlots } from '@/hooks/useParking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, ParkingSquare, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

interface ParkingSlot {
  id: string;
  number: string;
  location: string;
  type: string;
  pricePerHour: number;
  isAvailable: boolean;
  coordinates: { lat: number; lng: number };
}

const ExplorePage = () => {
  const { user } = useAuthCheck();
  const { data: availableSlotsData, isLoading: slotsLoading } = useAvailableSlots();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filteredSlots, setFilteredSlots] = useState<ParkingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  const availableSlots: ParkingSlot[] = useMemo(() => availableSlotsData?.data || [], [availableSlotsData]);

  // Filter slots based on search and type
  useEffect(() => {
    const filtered = availableSlots
      .filter(slot => {
        if (searchQuery) {
          return (
            slot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            slot.number.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return true;
      })
      .filter(slot => filterType === 'all' || slot.type.toLowerCase() === filterType.toLowerCase());

    // Only update state if filtered results have changed
    if (JSON.stringify(filtered) !== JSON.stringify(filteredSlots)) {
      setFilteredSlots(filtered);
    }
  }, [searchQuery, filterType, availableSlots, filteredSlots]);

  // Format price for display
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}/hr`;
  };

  if (slotsLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
          Explore Parking
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
        Find Parking, {user?.firstName}!
      </h1>
      <p className="text-gray-500 mb-8">Search and book available parking slots near you</p>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by location or slot number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-blue-200 focus:ring-blue-500"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-48 border-blue-200">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
            <SelectItem value="electric">Electric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Parking Slots List */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ParkingSquare className="h-5 w-5 mr-2 text-blue-500" />
            Available Slots
          </CardTitle>
          <CardDescription>{filteredSlots.length} slots found</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSlots.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No parking slots found. Try adjusting your search or filters.
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {filteredSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedSlot?.id === slot.id ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 p-2 text-white">
                      <ParkingSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Slot #{slot.number}</div>
                      <div className="text-sm text-gray-500">{slot.location}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">{slot.type}</Badge>
                        <Badge className="bg-green-100 text-green-800">Available</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(slot.pricePerHour)}</div>
                    <Link href={`/dashboard/bookings/new?slotId=${slot.id}`}>
                      <Button
                        size="sm"
                        className="mt-2 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white"
                      >
                        Book Now
                      </Button>
                    </Link>
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
          <CardDescription className="text-white/80">Manage your parking needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Link href="/dashboard/bookings" className="flex flex-col items-center gap-2 h-full w-full">
                <Clock className="h-5 w-5" />
                <span>View Bookings</span>
              </Link>
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Link href="/dashboard/vehicles" className="flex flex-col items-center gap-2 h-full w-full">
                <ParkingSquare className="h-5 w-5" />
                <span>Manage Vehicles</span>
              </Link>
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Link href="/dashboard/payments" className="flex flex-col items-center gap-2 h-full w-full">
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

export default ExplorePage;