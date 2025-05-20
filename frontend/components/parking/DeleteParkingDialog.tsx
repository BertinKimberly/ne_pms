"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useDeleteParkingLocation, ParkingLocation } from "@/hooks/useParkingLocations";

interface DeleteParkingDialogProps {
  parking: ParkingLocation;
}

export function DeleteParkingDialog({ parking }: DeleteParkingDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteParkingLocation();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(parking.id);
      setOpen(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="h-8 w-8">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Parking Location
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the parking location "{parking.name}" ({parking.code})? 
            This action cannot be undone, and all associated data may be lost.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-md text-sm">
            <strong>Warning:</strong> If this parking location has active vehicle entries, you will not be able to delete it.
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 