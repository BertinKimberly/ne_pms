"use client";
import React, { useState } from "react";
import { User, LogOut, FolderKanban, Car, FolderOpenDot, Settings, Menu } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const MobileNav = () => {
   const { user } = useAuthStore();
   const router = useRouter();
   const pathname = usePathname();
   const [isLoggingOut, setIsLoggingOut] = useState(false);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const handleLogout = () => {
      setIsLoggingOut(true);
      cookies.remove("auth_token");
      router.push("/");
      setIsLoggingOut(false);
   };

   const navLinks = [
      {
         name: "Dashboard",
         path: "/dashboard",
         icon: <FolderKanban className="h-4 w-4" />
      },
      {
         name: "Explore",
         path: "/dashboard/explore",
         icon: <Car className="h-4 w-4" />
      },
      {
         name: "Bookings",
         path: "/dashboard/bookings",
         icon: <FolderOpenDot className="h-4 w-4" />
      },
      {
         name: "Account",
         path: "/dashboard/account",
         icon: <Settings className="h-4 w-4" />
      }
   ];

   return (
      <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 p-4 text-white md:hidden sticky top-0 w-full z-40 shadow-md">
         <div className="flex justify-between items-center mb-4">
            <div>
               <h3 className="font-medium text-lg">TMS</h3>
               <div className="flex items-center gap-1">
                  <span className="text-xs text-white/80">Hello,</span>
                  <span className="text-sm font-medium">{user && user.firstName}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
               >
                  <Menu className="h-5 w-5" />
               </Button>
               
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center p-0"
                     >
                        <User className="text-white h-5 w-5" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mr-2 mt-1">
                     <div className="flex items-center justify-start p-2 gap-3 border-b mb-1">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 flex items-center justify-center">
                           <span className="text-white text-sm font-medium">
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                           </span>
                        </div>
                        <div className="flex flex-col">
                           <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                           <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                     </div>
                     
                     <DropdownMenuGroup>
                        {navLinks.map((link) => (
                           <DropdownMenuItem key={link.path} asChild>
                              <Link 
                                 href={link.path}
                                 className={`flex w-full items-center p-2 ${
                                    pathname === link.path 
                                       ? "bg-blue-50 text-blue-600" 
                                       : "text-gray-700"
                                 }`}
                              >
                                 <span className="mr-2">{link.icon}</span>
                                 <span>{link.name}</span>
                              </Link>
                           </DropdownMenuItem>
                        ))}
                     </DropdownMenuGroup>
                     
                     <DropdownMenuSeparator />
                     
                     <DropdownMenuItem asChild>
                        <Button
                           onClick={() => setIsDialogOpen(true)}
                           variant="ghost"
                           className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                        >
                           <LogOut className="mr-2 h-4 w-4" />
                           <span>Log out</span>
                        </Button>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>

         {/* Mobile Navigation Tabs */}
         <div className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-lg p-2 mb-2 transition-all duration-300 ease-in-out`}>
            {navLinks.map((link) => (
               <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-2 px-4 py-3 rounded-md transition-colors ${
                     pathname === link.path
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
               >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
               </Link>
            ))}
         </div>

         <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
         >
            <DialogContent
               className="bg-white p-[2px] w-[90%] sm:max-w-[425px]"
               style={{
                  backgroundImage:
                     "linear-gradient(white, white), linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
               }}
            >
               <DialogHeader>
                  <DialogTitle className="p-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                     Confirm Logout
                  </DialogTitle>
                  <DialogDescription className="px-4">
                     Are you sure you want to log out? This action will end your
                     session.
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
                     disabled={isLoggingOut}
                     className="bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-400 text-white"
                  >
                     {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default MobileNav;