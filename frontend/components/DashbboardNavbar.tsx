"use client";

import React from "react";
import { MapPin, Calendar, User, Bell, Search } from "lucide-react";
import { useSidebarState } from "@/hooks/useSidebarState";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardNavbar = () => {
   const { isCollapsed, mobileWidth, isClient } = useSidebarState();
   const { user } = useAuthStore();
   const pathname = usePathname();

   if (!isClient) {
      return null;
   }

   return (
      <div
         className={`sticky top-0 bg-white z-30 border-b transition-all duration-300 px-4 py-3 lg:px-6 ${
            mobileWidth ? "hidden" : ""
         }`}
      >
         <div className="flex items-center justify-between">
            {/* Left Section - Welcome Message */}
            <div className="flex flex-col">
               <h3 className="text-gray-800 font-semibold">
                  Welcome back, <span className="text-blue-600">{user?.firstName || 'User'}</span>
               </h3>
               <p className="text-xs text-gray-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
               </p>
            </div>

            {/* Right Section - Search & Quick Actions */}
            <div className="flex items-center gap-3">
               {/* Search Input */}
               <div className="relative hidden md:flex items-center max-w-xs">
                  <div className="absolute left-3 text-gray-400">
                     <Search size={16} />
                  </div>
                  <input 
                     type="text" 
                     placeholder="Search..."
                     className="pl-9 pr-4 py-2 rounded-md bg-gray-100 text-sm w-40 lg:w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
               </div>

               {/* Quick Action Buttons */}
               <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                     <Bell size={18} />
                  </Button>
                  
                  <Link href="/dashboard/explore">
                     <Button 
                        variant="ghost" 
                        size="sm"
                        className={`rounded-full flex items-center gap-1 ${
                           pathname.includes('/explore') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                     >
                        <MapPin size={16} />
                        <span className="hidden lg:inline-block">Explore</span>
                     </Button>
                  </Link>
                  
                  <Link href="/dashboard/bookings">
                     <Button 
                        variant="ghost" 
                        size="sm"
                        className={`rounded-full flex items-center gap-1 ${
                           pathname.includes('/bookings') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                     >
                        <Calendar size={16} />
                        <span className="hidden lg:inline-block">Bookings</span>
                     </Button>
                  </Link>
                  
                  {/* User Profile Dropdown */}
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 flex items-center justify-center text-white text-sm font-medium">
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                           </div>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-56">
                        <div className="flex items-center p-3 border-b">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 flex items-center justify-center text-white text-sm font-medium mr-3">
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                           </div>
                           <div>
                              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                              <p className="text-xs text-gray-500">{user?.email}</p>
                           </div>
                        </div>
                        
                        <DropdownMenuGroup className="p-1">
                           <DropdownMenuItem asChild>
                              <Link href="/dashboard/account" className="flex items-center cursor-pointer">
                                 <User className="mr-2 h-4 w-4" />
                                 <span>My Account</span>
                              </Link>
                           </DropdownMenuItem>
                           
                           <DropdownMenuItem asChild>
                              <Link href="/dashboard/bookings" className="flex items-center cursor-pointer">
                                 <Calendar className="mr-2 h-4 w-4" />
                                 <span>My Bookings</span>
                              </Link>
                           </DropdownMenuItem>
                        </DropdownMenuGroup>
                        
                        <DropdownMenuSeparator />
                        
                        <div className="p-2">
                           <Button 
                              variant="outline"
                              className="w-full justify-center bg-gray-50 hover:bg-gray-100 border-gray-200"
                           >
                              Sign out
                           </Button>
                        </div>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
         </div>
      </div>
   );
};

export default DashboardNavbar;