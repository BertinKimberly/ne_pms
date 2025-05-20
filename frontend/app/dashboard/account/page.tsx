//@ts-nocheck
"use client";

import React, { useState } from 'react';
import { useAuthStore } from "@/store/useAuthStore";
import { useLogoutUser } from "@/hooks/useAuth";
import { 
  User,
  Camera,
  Edit,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const AccountPage = () => {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const logout = useLogoutUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userForm, setUserForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || ""
  });

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push("/");
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      // In a real app, you would call an API to update the user profile
      // Example API call:
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userForm),
      // });
      // const updatedUser = await response.json();
      
      // For now, we'll just simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the local user state
      setUser({ ...user, ...userForm });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-500">Manage your personal information</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6 relative">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 flex items-center justify-center text-white text-3xl font-bold mb-4">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <button className="absolute bottom-2 right-0 bg-white rounded-full p-1 shadow-md">
              <Camera size={18} className="text-blue-500" />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800">{user?.firstName} {user?.lastName}</h2>
          <p className="text-gray-500">{user?.email}</p>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs mt-2">
            {user?.role === "admin" ? "Administrator" : "User"}
          </span>
        </div>

        <div className="border-t pt-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userForm.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userForm.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white"
                >
                  {isLoading ? "Saving..." : (
                    <>
                      <Save size={16} className="mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-blue-600 border-blue-300"
                >
                  <Edit size={14} /> Edit
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium">{user?.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium">{user?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="flex items-center justify-center gap-2"
            >
              Logout
            </Button>
          </DialogTrigger>

          <DialogContent className="w-[90%] sm:max-w-[425px] bg-white p-[2px]"
            style={{
              backgroundImage:
                "linear-gradient(white, white), linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)",
              backgroundOrigin: "border-box",
              backgroundClip: "content-box, border-box",
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 p-4">
                Confirm Logout
              </DialogTitle>
              <DialogDescription className="px-4">
                Are you sure you want to log out? This action will end your session.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-start gap-4 p-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                disabled={logout.isPending}
                className="bg-gradient-to-br from-pink-500 via-indigo-500 to-blue-500 text-white"
              >
                {logout.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AccountPage;