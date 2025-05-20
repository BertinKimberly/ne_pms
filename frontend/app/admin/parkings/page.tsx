"use client";

import React, { useState } from 'react';
import { Loader2, MapPin, Search, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { AddParkingDialog } from "@/components/parking/AddParkingDialog";
import { EditParkingDialog } from "@/components/parking/EditParkingDialog";
import { DeleteParkingDialog } from "@/components/parking/DeleteParkingDialog";
import { 
  useParkingLocations, 
  ParkingLocation 
} from "@/hooks/useParkingLocations";
import { useAuthCheck } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const ParkingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: parkingsData, isLoading, isError } = useParkingLocations();
  const { isAuthenticated, hasRequiredRole } = useAuthCheck('ADMIN');
  const router = useRouter();

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!hasRequiredRole) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, hasRequiredRole, router]);

  const columns: ColumnDef<ParkingLocation>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.code}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-500" />
          <span>{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "totalSpaces",
      header: "Total Spaces",
      cell: ({ row }) => (
        <div className="text-center">{row.original.totalSpaces}</div>
      ),
    },
    {
      accessorKey: "availableSpaces",
      header: "Available",
      cell: ({ row }) => {
        const available = row.original.availableSpaces;
        const total = row.original.totalSpaces;
        const percentage = Math.round((available / total) * 100);
        
        let badgeColor = "bg-green-100 text-green-800";
        if (percentage < 20) {
          badgeColor = "bg-red-100 text-red-800";
        } else if (percentage < 50) {
          badgeColor = "bg-orange-100 text-orange-800";
        }
        
        return (
          <div className="flex justify-center">
            <Badge className={badgeColor}>
              {available} / {total}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "feePerHour",
      header: "Fee/Hour",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.original.feePerHour.toLocaleString()} RWF
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const parking = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <EditParkingDialog parking={parking} />
            <DeleteParkingDialog parking={parking} />
          </div>
        );
      },
    },
  ];

  // Filter the parkings based on the search query
  const filteredParkings = (parkingsData?.data || []).filter(
    (parking) =>
      parking.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parking.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated || !hasRequiredRole) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Parking Locations
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage all parking locations in the system
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search parkings..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AddParkingDialog />
        </div>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-red-500">Error loading parking locations</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">
                  Total Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{parkingsData?.data?.length || 0}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-600">
                  Total Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parkingsData?.data?.reduce((sum, parking) => sum + parking.totalSpaces, 0) || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-600">
                  Available Spaces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parkingsData?.data?.reduce((sum, parking) => sum + parking.availableSpaces, 0) || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {filteredParkings.length === 0 && searchQuery ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">
                  No parking locations found for "{searchQuery}"
                </p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <DataTable
              columns={columns}
              data={filteredParkings}
              searchKey="name"
              searchPlaceholder="Filter parkings..."
            />
          )}
        </>
      )}
    </div>
  );
};

export default ParkingsPage;
