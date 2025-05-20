import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   role: string;
}

interface AuthState {
   user: User | null;
   isAuthenticated: boolean | null;
   setUser: (data: User | null) => void;
   setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
   persist(
      (set) => ({
         user: null,
         isAuthenticated: null,
         setUser: (data: User | null) => set({ user: data }),
         setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      }),
      {
         name: "auth-storage", // Key in localStorage
         storage: createJSONStorage(() => localStorage), // Use localStorage
      }
   )
);