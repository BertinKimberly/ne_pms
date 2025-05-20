"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Loader2, Mail, RefreshCw, ArrowLeft } from "lucide-react";

// Mock function - replace with your actual API call
const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Password reset link sent" });
    }, 1500);
  });
};

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await requestPasswordReset(data.email);

      if (response.success) {
        setUserEmail(data.email);
        setEmailSent(true);
        toast.success("Reset instructions sent to your email");
      } else {
        toast.error(response.message || "Failed to send reset instructions");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    form.reset();
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
        
        {!emailSent ? (
          <>
            <div className="flex flex-col items-center justify-center pt-10 pb-4">
              <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg mb-4">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-1">Reset Password</h2>
              <p className="text-center text-muted-foreground px-6">
                Enter your email address and we'll send you instructions to reset your password
              </p>
            </div>
            
            <CardContent className="px-8 pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email Address</FormLabel>
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
                  <Button
                    type="submit"
                    className="w-full h-12 font-medium bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending instructions...
                      </>
                    ) : (
                      "Send reset instructions"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 mb-6 bg-blue-50 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent password reset instructions to:<br/>
              <span className="font-medium text-blue-600 mt-1 block">{userEmail}</span>
            </p>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full h-11 border-slate-200 hover:bg-slate-50"
                onClick={handleTryAgain}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try a different email
              </Button>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or{" "}
                <button 
                  type="button" 
                  onClick={handleTryAgain} 
                  className="text-blue-600 hover:underline font-medium"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        )}
        
        <CardFooter className="flex justify-center border-t p-6">
          <Link 
            href="/login" 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;