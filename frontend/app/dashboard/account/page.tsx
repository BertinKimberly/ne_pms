"use client";

import React, { useState } from 'react';
import { useAuthStore } from "@/store/useAuthStore";
import { useLogoutUser } from "@/hooks/useAuth";
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  LockKeyhole, 
  CheckCircle,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { log } from 'console';

const AccountPage = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const logout = useLogoutUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // In a real app, you would call an API to update the user profile
    // For now, we'll just toggle the editing state
    setIsEditing(false);
  };

  // Content for different tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
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
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white"
                    >
                      <Save size={16} className="mr-2" /> Save Changes
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
        );
      case "security":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <LockKeyhole size={18} className="text-blue-500" />
                    <h4 className="font-medium">Password</h4>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600 border-blue-300"
                  >
                    Change
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Last changed 3 months ago</p>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Shield size={18} className="text-blue-500" />
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600 border-blue-300"
                  >
                    Setup
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Shield size={18} className="text-blue-500" />
                    <h4 className="font-medium">Login History</h4>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600 border-blue-300"
                  >
                    View
                  </Button>
                </div>
                <p className="text-sm text-gray-500">See your recent login activity</p>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Notifications Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive booking updates, promotions and news</p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                  <span className="absolute cursor-pointer inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-6"></span>
                </label>
              </div>
              
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-gray-500">Receive booking confirmation and reminders</p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" className="opacity-0 w-0 h-0" />
                  <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-all duration-300 before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-6 checked:bg-gradient-to-r checked:from-blue-500 checked:to-indigo-500"></span>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Marketing Preferences</h4>
                  <p className="text-sm text-gray-500">Receive offers and promotions</p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                  <span className="absolute cursor-pointer inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 checked:before:translate-x-6"></span>
                </label>
              </div>
            </div>
          </div>
        );
      case "payment":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded flex items-center justify-center text-white">
                  <CreditCard size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Visa ending in 4242</h4>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                      <CheckCircle size={12} className="mr-1" /> Primary
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Expires 04/2026</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-blue-600 border-blue-300"
                >
                  Edit
                </Button>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  className="text-blue-600 border-blue-300"
                >
                  + Add Payment Method
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  console.log("Ntacyo nzoba",user);
  

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-500">Manage your account information and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="py-4 px-6 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-white/80">{user?.email}</p>
                </div>
              </div>
            </div>
            <nav className="p-2">
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
                      activeTab === "profile" 
                        ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 font-medium" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <User size={18} />
                    Profile
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab("security")}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
                      activeTab === "security" 
                        ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 font-medium" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Shield size={18} />
                    Security
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
                      activeTab === "notifications" 
                        ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 font-medium" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Bell size={18} />
                    Notifications
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab("payment")}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
                      activeTab === "payment" 
                        ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 font-medium" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <CreditCard size={18} />
                    Payment Methods
                  </button>
                </li>
              </ul>
            </nav>
            <div className="p-4 border-t">
              <Dialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
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
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;