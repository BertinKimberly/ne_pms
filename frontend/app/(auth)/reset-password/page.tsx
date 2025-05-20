"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

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
import { Loader2, Lock, ShieldCheck } from "lucide-react";

// Mock function - replace with your actual API call
const resetPassword = async (data: {
  token: string;
  password: string;
}): Promise<{ success: boolean; message: string }> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Password reset successful" });
    }, 1500);
  });
};

const formSchema = z
  .object({
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const ResetPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    if (!token) {
      toast.error("Invalid or expired password reset link");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await resetPassword({ 
        token, 
        password: data.password 
      });

      if (response.success) {
        setIsComplete(true);
        toast.success("Password has been reset successfully!");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedirectToLogin = () => {
    router.push("/login");
  };

  // If no token is provided, show error
  if (!token && !isComplete) {
    return (
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 800 800"
            opacity="0.7"
          >
            <defs>
              <filter id="bbblurry-filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="40" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
              </filter>
            </defs>
            <g filter="url(#bbblurry-filter)">
              <ellipse rx="150" ry="150" cx="181.0337954401028" cy="220.17804828283306" fill="#0ea5e9"></ellipse>
              <ellipse rx="150" ry="150" cx="697.5127576181023" cy="304.1771755703736" fill="#6366f1"></ellipse>
              <ellipse rx="150" ry="150" cx="337.0200583711153" cy="643.1394487265782" fill="#64a2ff"></ellipse>
            </g>
          </svg>
        </div>

        <Card className="w-full max-w-md border-none bg-white/90 backdrop-blur-md shadow-2xl relative overflow-hidden mx-auto">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Invalid Reset Link</h2>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired. Please request a new password reset link.
            </p>
            <Button 
              className="w-full h-11 font-medium bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md"
              onClick={() => router.push("/forgot-password")}
            >
              Request new link
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
            <filter id="bbblurry-filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="40" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
            </filter>
          </defs>
          <g filter="url(#bbblurry-filter)">
            <ellipse rx="150" ry="150" cx="181.0337954401028" cy="220.17804828283306" fill="#0ea5e9"></ellipse>
            <ellipse rx="150" ry="150" cx="697.5127576181023" cy="304.1771755703736" fill="#6366f1"></ellipse>
            <ellipse rx="150" ry="150" cx="337.0200583711153" cy="643.1394487265782" fill="#64a2ff"></ellipse>
          </g>
        </svg>
      </div>

      <Card className="w-full max-w-md border-none bg-white/90 backdrop-blur-md shadow-2xl relative overflow-hidden mx-auto">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>
        
        {!isComplete ? (
          <>
            <div className="flex flex-col items-center justify-center pt-10 pb-4">
              <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-1">Set New Password</h2>
              <p className="text-center text-muted-foreground px-6">
                Create a new secure password for your FleetFlow account
              </p>
            </div>
            
            <CardContent className="px-8 pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-3 text-muted-foreground">
                              <Lock className="h-5 w-5" />
                            </div>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              className="h-12 pl-10 bg-white/70 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs font-medium text-red-500" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Must be at least 8 characters with uppercase, lowercase and numbers
                        </p>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-3 text-muted-foreground">
                              <Lock className="h-5 w-5" />
                            </div>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              className="h-12 pl-10 bg-white/70 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs font-medium text-red-500" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-12 font-medium bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 mb-6 bg-green-50 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Password Reset Complete</h2>
            <p className="text-muted-foreground mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Button 
              className="w-full h-11 font-medium bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md"
              onClick={handleRedirectToLogin}
            >
              Sign in
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordPage;