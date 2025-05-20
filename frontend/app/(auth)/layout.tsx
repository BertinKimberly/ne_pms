"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
         {/* Decorative elements */}
         <div className="absolute top-10 left-10 w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-xl"></div>
         <div className="absolute bottom-10 right-10 w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-400/10 blur-xl"></div>
         
         {/* Truck icon SVG */}
         <div className="relative z-10 mb-6">
            <div className="flex items-center justify-center">
               <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="60" 
                  height="60" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="mb-2"
               >
                  <defs>
                     <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#6366F1" />
                     </linearGradient>
                  </defs>
                  <path d="M10 17h4V5H2v12h3"></path>
                  <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"></path>
                  <circle cx="7.5" cy="17.5" r="2.5"></circle>
                  <circle cx="17.5" cy="17.5" r="2.5"></circle>
               </svg>
            </div>
            <h1 className="text-center text-3xl font-bold">
               <Link href="/">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400">
                     FleetFlow
                  </span>
               </Link>
            </h1>
            <p className="text-center text-sm text-muted-foreground mt-1">Modern Transport Management System</p>
         </div>

         {/* Content */}
         <div className="w-full max-w-md">
            {children}
         </div>

         {/* Footer */}
         <footer className="mt-10 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} FleetFlow. All rights reserved.</p>
            <div className="mt-2 flex items-center justify-center space-x-4">
               <Link href="/help" className="hover:text-blue-600 transition-colors text-xs">Help</Link>
               <span className="text-slate-300">•</span>
               <Link href="/privacy" className="hover:text-blue-600 transition-colors text-xs">Privacy</Link>
               <span className="text-slate-300">•</span>
               <Link href="/terms" className="hover:text-blue-600 transition-colors text-xs">Terms</Link>
            </div>
         </footer>
      </div>
   );
};

export default AuthLayout;