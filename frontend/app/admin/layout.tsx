"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/DashbboardNavbar";
import SideNavbar from "@/components/SideNavbar";
import { useAuthCheck } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
   const router = useRouter();
   const { isAuthenticated, hasRequiredRole, isLoading, user } = useAuthCheck('ADMIN');

   useEffect(() => {
      if (!isLoading && !isAuthenticated) {
         router.push('/login');
      } else if (!isLoading && isAuthenticated && !hasRequiredRole) {
         router.push('/dashboard');
      }
   }, [isAuthenticated, hasRequiredRole, isLoading, router]);

   if (isLoading) {
      return (
         <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500">
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="h-12 w-12 animate-spin text-white" />
               <p className="text-lg text-white">Loading admin panel...</p>
            </div>
         </div>
      );
   }

   if (!isAuthenticated || !hasRequiredRole) {
      return null;
   }

   return (
      <div className="h-screen w-full bg-white flex overflow-y-hidden">
         <SideNavbar />
         <div className="flex flex-col w-full">
            <DashboardNavbar />
            <div className="p-6 bg-gray-50 w-full overflow-y-auto h-full">
               <div className="mx-auto">
                  {children}
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminLayout;
