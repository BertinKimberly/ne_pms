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
         
         

         {/* Content */}
         <div className="w-full max-w-md">
            {children}
         </div>

         {/* Footer */}
         <footer className="mt-10 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} XWZ. All rights reserved.</p>
            
         </footer>
      </div>
   );
};

export default AuthLayout;