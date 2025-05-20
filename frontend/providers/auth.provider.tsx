"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import BounceLoader from "react-spinners/BounceLoader";
import { useRouter } from "next/navigation";
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";

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
   
   const fetchUserProfile = async () => {
      try {
         const response = await handleApiRequest(() => authorizedAPI.get("/auth/profile"));
         
         if (response?.data) {
            setUser({
               id: response.data.id,
               firstName: response.data.firstName,
               lastName: response.data.lastName,
               email: response.data.email,
               role: response.data.role,
            });
            setIsAuthenticated(true);
            return true;
         }
         return false;
      } catch (error) {
         console.error("Error fetching user profile:", error);
         handleLogout();
         return false;
      }
   };

   const validateToken = async () => {
      try {
         const token = getCookie("auth_token");
         if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return false;
         }

         const decodedToken = jwtDecode<JwtPayload>(token);
         if (!decodedToken || !decodedToken.id) {
            handleLogout();
            setLoading(false);
            return false;
         }

         if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
            handleLogout();
            setLoading(false);
            return false;
         }

         // If user is not in store but token is valid, fetch user data
         if (!user) {
            await fetchUserProfile();
         } else {
            setIsAuthenticated(true);
         }
         
         setLoading(false);
         return true;
      } catch (error) {
         console.error("AuthProvider: Token validation error:", error);
         handleLogout();
         setLoading(false);
         return false;
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