import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/auth.provider";
import ReactQueryProvider from "@/providers/react.query.provider";
import NpProgress from "@/components/NpProgress";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parking Management System",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
               <ReactQueryProvider>
        {children}
          <NpProgress />
               </ReactQueryProvider>
            </AuthProvider>
            <Toaster
              position="bottom-right"
              richColors
              toastOptions={{
                className: "bg-white text-slate-900 dark:bg-slate-900 dark:text-white",
                style: {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            />
      </body>
    </html>
  );
}
