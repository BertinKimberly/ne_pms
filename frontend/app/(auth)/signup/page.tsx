"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Cookies } from "react-cookie";
import { toast } from "sonner";
import { useRegisterUser } from "@/hooks/useAuth";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, UserPlus, Mail, Lock, User } from "lucide-react";

const cookies = new Cookies();

const formSchema = z.object({
   firstName: z.string().min(2, "Name must be at least 2 characters"),
   lastName: z.string().min(2, "Name must be at least 2 characters"),
   email: z.string().email("Please enter a valid email address"),
   password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
   acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
   }),
});

type FormData = Omit<z.infer<typeof formSchema>, "acceptTerms">;

const SignupPage = () => {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const searchParams = useSearchParams();
   const redirectUrl = searchParams.get("redirectUrl");
   const registerUserMutation = useRegisterUser();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      mode: "onChange",
      defaultValues: {
         firstName: "",
         lastName: "",
         email: "",
         password: "",
         acceptTerms: false,
      },
   });

   const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);

      // Remove acceptTerms before submitting to API
      const { acceptTerms, ...submitData } = data;

      try {
         const response = await registerUserMutation.mutateAsync(
            submitData as FormData
         );

         if (response?.success) {
            toast.success("Account created successfully!");
            cookies.set("auth_token", response.token, { path: "/" });

            if (redirectUrl) {
               location.replace(redirectUrl);
            } else {
               response.data.role === "USER"
                  ? location.replace("/dashboard")
                  : location.replace("/admin");
            }
         } else {
            toast.error(response?.error?.msg || "Registration failed");
         }
      } catch (error) {
         toast.error("Something went wrong. Please try again.");
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
               <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg mb-4">
                  <UserPlus className="h-6 w-6 text-white" />
               </div>
               <h2 className="text-2xl font-bold text-center mb-1">
                  Create Account
               </h2>
               <p className="text-center text-muted-foreground">
                  Join XWZ to manage your transport system
               </p>
            </div>

            <CardContent className="px-8 pt-6">
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-4"
                  >
                     <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-sm font-medium">
                                 First Name
                              </FormLabel>
                              <FormControl>
                                 <div className="relative">
                                    <div className="absolute left-3 top-3 text-muted-foreground">
                                       <User className="h-5 w-5" />
                                    </div>
                                    <Input
                                       placeholder="John Doe"
                                       autoComplete="name"
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
                        name="lastName"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-sm font-medium">
                                 Last Name
                              </FormLabel>
                              <FormControl>
                                 <div className="relative">
                                    <div className="absolute left-3 top-3 text-muted-foreground">
                                       <User className="h-5 w-5" />
                                    </div>
                                    <Input
                                       placeholder="John Doe"
                                       autoComplete="name"
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
                              <FormLabel className="text-sm font-medium">
                                 Password
                              </FormLabel>
                              <FormControl>
                                 <div className="relative">
                                    <div className="absolute left-3 top-3 text-muted-foreground">
                                       <Lock className="h-5 w-5" />
                                    </div>
                                    <Input
                                       placeholder="Create a strong password"
                                       type="password"
                                       autoComplete="new-password"
                                       className="h-12 pl-10 bg-white/70 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                       {...field}
                                    />
                                 </div>
                              </FormControl>
                              <FormMessage className="text-xs font-medium text-red-500" />
                              <p className="text-xs text-muted-foreground mt-1">
                                 Must be at least 8 characters with uppercase,
                                 lowercase and numbers
                              </p>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="acceptTerms"
                        render={({ field }) => (
                           <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-slate-50">
                              <FormControl>
                                 <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                 />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                 <FormLabel className="text-sm font-normal">
                                    I agree to the{" "}
                                    <Link
                                       href="/terms"
                                       className="text-blue-600 hover:underline"
                                    >
                                       Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                       href="/privacy"
                                       className="text-blue-600 hover:underline"
                                    >
                                       Privacy Policy
                                    </Link>
                                 </FormLabel>
                                 <FormMessage className="text-xs font-medium text-red-500" />
                              </div>
                           </FormItem>
                        )}
                     />

                     <Button
                        type="submit"
                        className="w-full h-12 font-medium bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md mt-2"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? (
                           <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Creating account...
                           </>
                        ) : (
                           "Create account"
                        )}
                     </Button>
                  </form>
               </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-6">
               <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                     href="/login"
                     className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                     Sign in
                  </Link>
               </p>
            </CardFooter>
         </Card>
      </div>
   );
};

export default SignupPage;
