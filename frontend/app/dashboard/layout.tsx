"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/DashbboardNavbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import MobileNav from "@/components/MobileNav";
import { useAuthCheck } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
   const router = useRouter();
   const { isAuthenticated, isLoading } = useAuthCheck();

   useEffect(() => {
      if (!isLoading && !isAuthenticated) {
         router.push('/login');
      }
   }, [isAuthenticated, isLoading, router]);

   if (isLoading) {
      return (
         <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
               <p className="text-lg text-blue-800">Loading dashboard...</p>
            </div>
         </div>
      );
   }

   if (!isAuthenticated) {
      return null;
   }

   return (
      <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50 flex overflow-y-hidden">
         <DashboardSidebar />
         <div className="flex flex-col w-full">
            <MobileNav />
            <DashboardNavbar />
            <div className="p-4 md:p-6 w-full overflow-y-auto">
               <div className="mx-auto max-w-7xl">
                  {children}
               </div>
            </div>
         </div>
      </div>
   );
};

export default DashboardLayout;
