"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Activity, FileBarChart2, Calendar, Download, Search, Car, MapPin, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useActivitiesReport, useCompletedActivitiesReport } from "@/hooks/useParkingLocations";
import { useAuthCheck } from '@/hooks/useAuth';

// Define interfaces for report data
interface ParkingActivity {
  id: string;
  ticketNumber: string;
  entryDateTime: string;
  exitDateTime?: string;
  duration?: number;
  status: 'ACTIVE' | 'COMPLETED';
  vehicle: {
    plateNumber: string;
    type: string;
  };
  parking: {
    code: string;
    name: string;
    location: string;
    feePerHour: number;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const ReportsPage = () => {
  const router = useRouter();
  const { isAuthenticated, hasRequiredRole } = useAuthCheck('ADMIN');
  const [activeTab, setActiveTab] = useState('entries');
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch report data based on date range
  const entriesReport = useActivitiesReport(startDate, endDate);
  const exitsReport = useCompletedActivitiesReport(startDate, endDate);

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!hasRequiredRole) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, hasRequiredRole, router]);

  // Column definitions for entries report
  const entriesColumns: ColumnDef<ParkingActivity>[] = [
    {
      accessorKey: "ticketNumber",
      header: "Ticket",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.ticketNumber}</div>
      ),
    },
    {
      accessorKey: "vehicle.plateNumber",
      header: "Vehicle",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium flex items-center">
            <Car className="h-3 w-3 mr-1 text-blue-500" />
            {row.original.vehicle.plateNumber}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.vehicle.type}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "parking.name",
      header: "Parking",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-blue-500" />
            {row.original.parking.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.parking.location}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "entryDateTime",
      header: "Entry Time",
      cell: ({ row }) => {
        const date = new Date(row.original.entryDateTime);
        return (
          <div className="flex flex-col">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color = status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
        return (
          <Badge className={color}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "user.firstName",
      header: "Recorded By",
      cell: ({ row }) => (
        <div>
          {row.original.user.firstName} {row.original.user.lastName}
        </div>
      ),
    }
  ];

  // Column definitions for exits report
  const exitsColumns: ColumnDef<ParkingActivity>[] = [
    {
      accessorKey: "ticketNumber",
      header: "Ticket",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.ticketNumber}</div>
      ),
    },
    {
      accessorKey: "vehicle.plateNumber",
      header: "Vehicle",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium flex items-center">
            <Car className="h-3 w-3 mr-1 text-blue-500" />
            {row.original.vehicle.plateNumber}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.vehicle.type}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const duration = row.original.duration || 0;
        return (
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 text-blue-500" />
            {duration.toFixed(2)} hours
          </div>
        );
      },
    },
    {
      accessorKey: "parking.feePerHour",
      header: "Fee",
      cell: ({ row }) => {
        const feePerHour = row.original.parking.feePerHour;
        const duration = row.original.duration || 0;
        const totalFee = feePerHour * duration;
        return (
          <div className="font-medium text-right">
            {totalFee.toLocaleString()} RWF
          </div>
        );
      },
    },
    {
      accessorKey: "exitDateTime",
      header: "Exit Time",
      cell: ({ row }) => {
        const date = new Date(row.original.exitDateTime || '');
        return (
          <div className="flex flex-col">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "parking.name",
      header: "Parking",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium">
            {row.original.parking.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.parking.code}
          </div>
        </div>
      ),
    }
  ];

  // Filter function for searching in reports
  const filterActivities = (activities: ParkingActivity[]) => {
    if (!searchQuery) return activities;
    
    return activities.filter(activity => 
      activity.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.parking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.parking.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${activity.user.firstName} ${activity.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleGenerateReport = (type: string) => {
    // This would typically generate a CSV or PDF report
    // For now, just show a toast message
    alert(`Generating ${type} report for ${startDate} to ${endDate}`);
  };

  // Calculate summary metrics
  const entriesCount = entriesReport.data?.data?.length || 0;
  const exitsCount = exitsReport.data?.data?.length || 0;
  const totalRevenue = exitsReport.data?.data?.reduce((sum, activity) => {
    const duration = activity.duration || 0;
    return sum + (activity.parking.feePerHour * duration);
  }, 0) || 0;

  if (!isAuthenticated || !hasRequiredRole) {
    return null;
  }

  const isLoading = entriesReport.isLoading || exitsReport.isLoading;
  const isError = entriesReport.isError || exitsReport.isError;

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FileBarChart2 className="h-5 w-5 text-blue-500" />
            Parking Reports
          </h1>
          <p className="text-muted-foreground text-sm">
            View and generate reports for vehicle entries and exits
          </p>
        </div>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Report Filters</CardTitle>
          <CardDescription>Select date range and search criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ticket, plate number, or location..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                const weekAgo = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
                setStartDate(weekAgo);
                setEndDate(today);
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Total Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            ) : (
              <div className="text-2xl font-bold">{entriesCount}</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Total Exits
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-green-500" />
            ) : (
              <div className="text-2xl font-bold">{exitsCount}</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
            ) : (
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} RWF</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="entries" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Entries Report
          </TabsTrigger>
          <TabsTrigger value="exits" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Exits Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entries">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vehicle Entries</CardTitle>
                <CardDescription>
                  All vehicles that entered parking locations between {startDate} and {endDate}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleGenerateReport('entries')}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : isError ? (
                <div className="py-10 text-center">
                  <p className="text-red-500">Error loading report data</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => entriesReport.refetch()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  {filterActivities(entriesReport.data?.data || []).length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-muted-foreground">No entries found for the selected criteria</p>
                    </div>
                  ) : (
                    <DataTable
                      columns={entriesColumns}
                      data={filterActivities(entriesReport.data?.data || [])}
                      searchKey="vehicle.plateNumber"
                      searchPlaceholder="Filter entries..."
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exits">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vehicle Exits with Charges</CardTitle>
                <CardDescription>
                  All vehicles that exited parking locations between {startDate} and {endDate}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleGenerateReport('exits')}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : isError ? (
                <div className="py-10 text-center">
                  <p className="text-red-500">Error loading report data</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => exitsReport.refetch()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  {filterActivities(exitsReport.data?.data || []).length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="text-muted-foreground">No exits found for the selected criteria</p>
                    </div>
                  ) : (
                    <DataTable
                      columns={exitsColumns}
                      data={filterActivities(exitsReport.data?.data || [])}
                      searchKey="vehicle.plateNumber"
                      searchPlaceholder="Filter exits..."
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage; 