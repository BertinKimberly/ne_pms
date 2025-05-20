"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import BounceLoader from "react-spinners/BounceLoader";
import { useRouter } from "next/navigation";

interface AuthProviderProps {
   children: ReactNode;
}

interface JwtPayload {
   id: string;
   role: string;
   exp?: number;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
   const { user, setUser, setIsAuthenticated } = useAuthStore();
   const [loading, setLoading] = useState(true);
   const router = useRouter();

   const getCookie = (name: string): string | undefined => {
      if (typeof window === "undefined") return undefined;
      return document.cookie
         .split("; ")
         .find((row) => row.startsWith(`${name}=`))
         ?.split("=")[1];
   };

   const handleLogout = () => {
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
   };

   const validateToken = () => {
      try {
         const token = getCookie("auth_token");
         if (!token) {
            setIsAuthenticated(false);
            return false;
         }

         const decodedToken = jwtDecode<JwtPayload>(token);
         if (!decodedToken || !decodedToken.id) {
            handleLogout();
            return false;
         }

         if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
            handleLogout();
            return false;
         }

         // If user is not in store but token is valid, we might need to fetch user data
         if (!user) {
            // Optionally fetch user data from API using the token
            // For now, assume login sets the user
            setIsAuthenticated(true);
         } else {
            setIsAuthenticated(true);
         }
         return true;
      } catch (error) {
         console.error("AuthProvider: Token validation error:", error);
         handleLogout();
         return false;
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      validateToken();
   }, []);

   if (loading) {
      return (
         <div className="items-center justify-center flex min-h-screen">
            <div className="text-center">
               <BounceLoader color="#4A90E2" size={60} />
               <p className="mt-4 text-[#4A90E2]">Loading...</p>
            </div>
         </div>
      );
   }

   return <>{children}</>;
};

export default AuthProvider;