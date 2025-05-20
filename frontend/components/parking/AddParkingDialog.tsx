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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useCreateParkingLocation, CreateParkingLocationDto } from "@/hooks/useParkingLocations";
import { toast } from "sonner";

export function AddParkingDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateParkingLocationDto>({
    code: "",
    name: "",
    location: "",
    totalSpaces: 0,
    feePerHour: 0,
  });

  const createMutation = useCreateParkingLocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "totalSpaces" || name === "feePerHour" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.code || !formData.name || !formData.location || formData.totalSpaces <= 0 || formData.feePerHour <= 0) {
        toast.error("Please fill in all fields with valid values");
        return;
      }
      
      await createMutation.mutateAsync(formData);
      setOpen(false);
      setFormData({
        code: "",
        name: "",
        location: "",
        totalSpaces: 0,
        feePerHour: 0,
      });
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Parking Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Parking Location</DialogTitle>
          <DialogDescription>
            Enter the details for the new parking location. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Parking Code</Label>
            <Input
              id="code"
              name="code"
              placeholder="P001"
              value={formData.code}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Main Parking"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Kigali City Center"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="totalSpaces">Total Spaces</Label>
              <Input
                id="totalSpaces"
                name="totalSpaces"
                type="number"
                min="1"
                placeholder="100"
                value={formData.totalSpaces || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="feePerHour">Fee per Hour</Label>
              <Input
                id="feePerHour"
                name="feePerHour"
                type="number"
                min="0"
                step="0.01"
                placeholder="500"
                value={formData.feePerHour || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 