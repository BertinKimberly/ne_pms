"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useLoginUser } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

const LoginPage = () => {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const searchParams = useSearchParams();
   const router = useRouter();
   const redirectUrl = searchParams.get("redirectUrl");
   const loginMutation = useLoginUser();

   const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      mode: "onChange",
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit = async (data: FormData) => {
      setIsSubmitting(true);
      try {
         const response = await loginMutation.mutateAsync(data);
         console.log("Data from login mutation:", response);
         
         if (response?.data.user && response?.data.token) {
            document.cookie = `auth_token=${response.data.token}; path=/; max-age=${
               24 * 60 * 60
            }; SameSite=Strict; Secure`;

            if (redirectUrl) {
               router.push(redirectUrl);
            } else {
               const userData = response.data.user;
               const roleRedirects: Record<string, string> = {
                  ADMIN: "/admin",
                  COMPANY_ADMIN: "/company-admin",
                  USER: "/dashboard",
               };
               const redirectPath =
                  roleRedirects[userData.role as string] || "/dashboard";
               router.push(redirectPath);
            }
         }

         console.log("Login successful:", response);
         
      } catch (error) {
         // Error is already handled in useLoginUser's onError
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="relative">
         {/* Animated SVG Background */}
         <div className="absolute inset-0 -z-10 overflow-hidden">
            <svg
               className="absolute h-full w-full"
               xmlns="http://www.w3.org/2000/svg"
               version="1.1"
               viewBox="0 0 800 800"
               opacity="0.7"
            >
               <defs>
                  <filter
                     id="bbblurry-filter"
                     x="-100%"
                     y="-100%"
                     width="400%"
                     height="400%"
                     filterUnits="objectBoundingBox"
                     primitiveUnits="userSpaceOnUse"
                     colorInterpolationFilters="sRGB"
                  >
                     <feGaussianBlur
                        stdDeviation="40"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        in="SourceGraphic"
                        edgeMode="none"
                        result="blur"
                     ></feGaussianBlur>
                  </filter>
               </defs>
               <g filter="url(#bbblurry-filter)">
                  <ellipse
                     rx="150"
                     ry="150"
                     cx="181.0337954401028"
                     cy="220.17804828283306"
                     fill="#0ea5e9"
                  ></ellipse>
                  <ellipse
                     rx="150"
                     ry="150"
                     cx="697.5127576181023"
                     cy="304.1771755703736"
                     fill="#6366f1"
                  ></ellipse>
                  <ellipse
                     rx="150"
                     ry="150"
                     cx="337.0200583711153"
                     cy="643.1394487265782"
                     fill="#64a2ff"
                  ></ellipse>
               </g>
            </svg>
         </div>

         <Card className="w-full max-w-md border-none bg-white/90 backdrop-blur-md shadow-2xl relative overflow-hidden mx-auto">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>

            <div className="flex flex-col items-center justify-center pt-10 pb-4">
              
               <h2 className="text-2xl font-bold text-center mb-1">
                  Welcome Back
               </h2>
               <p className="text-center text-muted-foreground">
                  Sign in to your XWZ account
               </p>
            </div>

            <CardContent className="px-8 pt-6">
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-5"
                  >
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-sm font-medium">
                                 Email Address
                              </FormLabel>
                              <FormControl>
                                 <div className="relative">
                                    <div className="absolute left-3 top-3 text-muted-foreground">
                                       <Mail className="h-5 w-5" />
                                    </div>
                                    <Input
                                       placeholder="name@company.com"
                                       type="email"
                                       autoComplete="email"
                                       className="h-12 pl-10 bg-white/70 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                       {...field}
                                    />
                                 </div>
                              </FormControl>
                              <FormMessage className="text-xs font-medium text-red-500" />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                              <div className="flex items-center justify-between">
                                 <FormLabel className="text-sm font-medium">
                                    Password
                                 </FormLabel>
                                 <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                 >
                                    Forgot password?
                                 </Link>
                              </div>
                              <FormControl>
                                 <div className="relative">
                                    <div className="absolute left-3 top-3 text-muted-foreground">
                                       <Lock className="h-5 w-5" />
                                    </div>
                                    <Input
                                       placeholder="••••••••"
                                       type={showPassword ? "text" : "password"}
                                       autoComplete="current-password"
                                       className="h-12 pl-10 pr-10 bg-white/70 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                       {...field}
                                    />
                                    <button
                                       type="button"
                                       className="absolute right-3 top-3 text-muted-foreground"
                                       onClick={() =>
                                          setShowPassword(!showPassword)
                                       }
                                    >
                                       {showPassword ? (
                                          <EyeOff className="h-5 w-5" />
                                       ) : (
                                          <Eye className="h-5 w-5" />
                                       )}
                                    </button>
                                 </div>
                              </FormControl>
                              <FormMessage className="text-xs font-medium text-red-500" />
                           </FormItem>
                        )}
                     />
                     <Button
                        type="submit"
                        className="w-full h-12 text-white font-medium bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md cursor-pointer"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? (
                           <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Signing in...
                           </>
                        ) : (
                           "Sign in to account"
                        )}
                     </Button>
                  </form>
               </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-6">
               <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                     href="/signup"
                     className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                     Create your account
                  </Link>
               </p>
            </CardFooter>
         </Card>
      </div>
   );
};

export default LoginPage;