import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI, unauthorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface User {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   role: string;
}

interface LoginData {
   email: string;
   password: string;
}

const loginUser = (userData: LoginData) => {
   return handleApiRequest(() => unauthorizedAPI.post("/auth/login", userData));
};

const registerUser = (userData: Partial<User>) => {
   return handleApiRequest(() => unauthorizedAPI.post("/auth/register", userData));
};

const logoutUser = () => {
   return handleApiRequest(() => authorizedAPI.post("/auth/logout"));
};

export const useLoginUser = () => {
   const setUser = useAuthStore((state) => state.setUser);
   const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

   return useMutation({
      mutationFn: loginUser,
      onSuccess: (data: any) => {
         if (data?.user && data?.token) {
            const userData = data.user;
            setUser({
               id: userData.id,
               firstName: userData.firstName,
               lastName: userData.lastName,
               email: userData.email,
               role: userData.role,
            });
            setIsAuthenticated(true);
            toast.success("Login successful!");
            return data;
         } else {
            throw new Error(data?.message || "Login failed");
         }
      },
      onError: (error: any) => {
         const message = error?.data?.message || error?.message || "Login failed. Please try again.";
         toast.error(message);
      },
   });
};

export const useRegisterUser = () => {
   return useMutation({
      mutationFn: registerUser,
      onSuccess: (data: any) => {
         toast.success("Signup successful! Please log in.");
         return data;
      },
      onError: (error: any) => {
         const message = error?.data?.message || error?.message || "Signup failed. Please try again.";
         toast.error(message);
      },
   });
};

export const useLogoutUser = () => {
   const setUser = useAuthStore((state) => state.setUser);
   const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

   return useMutation({
      mutationFn: logoutUser,
      onSuccess: () => {
         setUser(null);
         setIsAuthenticated(false);
         document.cookie = "auth_token=; Max-Age=0; path=/;";
         toast.success("Logged out successfully!");
         return { success: true };
      },
      onError: (error: any) => {
         setUser(null);
         setIsAuthenticated(false);
         document.cookie = "auth_token=; Max-Age=0; path=/;";
         toast.success("Logged out successfully!");
         return { success: true };
      },
   });
};

export const useAuthCheck = (requiredRole?: string) => {
   const { user, isAuthenticated } = useAuthStore();
   return {
      isAuthenticated,
      user,
      hasRequiredRole: user?.role === requiredRole,
   };
};