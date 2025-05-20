import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Link from "next/link";

const HomePage: React.FC = () => {
   return (
      <>
         <Header />
         <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center justify-center">
            {/* Simple Welcome Section */}
            <section className="container mx-auto px-4 text-center">
               <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400">
                  Welcome to XWZ
               </h1>
               <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                  Your complete parking management solution
               </p>
               <div className="flex flex-wrap justify-center gap-4">
                  <Button
                     size="lg"
                     asChild
                     className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md"
                  >
                     <Link href="/login">Get Started</Link>
                  </Button>
               </div>
            </section>
         </div>
      </>
   );
};

export default HomePage;
