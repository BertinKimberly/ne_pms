"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Map, ArrowRight, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Header from "@/components/Header";

interface BusRoute {
   id: string;
   from: string;
   to: string;
   departureDate: Date;
   departureTime: string;
   arrivalTime: string;
   duration: string;
   price: number;
   seats: number;
   busCompany: string;
   busType: string;
}

const SearchPage: React.FC = () => {
   const searchParams = useSearchParams();
   const router = useRouter();
   const [date, setDate] = useState<Date | undefined>(new Date());
   const [results, setResults] = useState<BusRoute[]>([]);
   const [loading, setLoading] = useState(false);
   const [searched, setSearched] = useState(false);
   const [sortOrder, setSortOrder] = useState<"price" | "time" | "duration">(
      "time"
   );

   const initialFrom = searchParams.get("from") || "";
   const initialTo = searchParams.get("to") || "";

   const [from, setFrom] = useState(initialFrom);
   const [to, setTo] = useState(initialTo);

   useEffect(() => {
      setFrom(searchParams.get("from") || "");
      setTo(searchParams.get("to") || "");
      const dateParam = searchParams.get("date");
      if (dateParam) {
         const parsedDate = new Date(dateParam);
         if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
         }
      }
   }, [searchParams]);

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setSearched(true);

      // Update URL search params
      const newParams = new URLSearchParams();
      if (from) newParams.set("from", from);
      if (to) newParams.set("to", to);
      if (date) newParams.set("date", format(date, "yyyy-MM-dd"));
      router.push(`/search?${newParams.toString()}`);

      // Simulate API call with timeout
      setTimeout(() => {
         setResults(
            mockRoutes.filter((route) => {
               return (
                  (from === "" ||
                     route.from.toLowerCase().includes(from.toLowerCase())) &&
                  (to === "" ||
                     route.to.toLowerCase().includes(to.toLowerCase()))
               );
            })
         );
         setLoading(false);
      }, 1000);
   };

   const sortedResults = [...results].sort((a, b) => {
      switch (sortOrder) {
         case "price":
            return a.price - b.price;
         case "time":
            return a.departureTime.localeCompare(b.departureTime);
         case "duration":
            return a.duration.localeCompare(b.duration);
         default:
            return 0;
      }
   });

   return (
      <>
         <Header />
         <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
            <div className="bg-bus-primary text-white py-16">
               <div className="container mx-auto px-4">
                  <h1 className="text-3xl font-bold mb-6">Search Bus Routes</h1>
                  <Card className="bg-white/90 backdrop-blur-md shadow-2xl">
                     <CardContent className="p-6">
                        <form
                           onSubmit={handleSearch}
                           className="flex flex-col md:flex-row gap-4"
                        >
                           <div className="flex-1 space-y-2">
                              <Label htmlFor="from">From</Label>
                              <Input
                                 id="from"
                                 placeholder="Departure City"
                                 value={from}
                                 onChange={(e) => setFrom(e.target.value)}
                                 className="bg-white/70 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                              />
                           </div>

                           <div className="flex-1 space-y-2">
                              <Label htmlFor="to">To</Label>
                              <Input
                                 id="to"
                                 placeholder="Destination City"
                                 value={to}
                                 onChange={(e) => setTo(e.target.value)}
                                 className="bg-white/70 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                              />
                           </div>

                           <div className="flex-1 space-y-2">
                              <Label htmlFor="date">Date</Label>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button
                                       variant="outline"
                                       className="w-full justify-start text-left font-normal bg-white"
                                       id="date"
                                    >
                                       <CalendarIcon className="mr-2 h-4 w-4" />
                                       {date ? (
                                          format(date, "PPP")
                                       ) : (
                                          <span>Pick a date</span>
                                       )}
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-auto p-0">
                                    <Calendar
                                       mode="single"
                                       selected={date}
                                       onSelect={setDate}
                                       initialFocus
                                       disabled={(date) =>
                                          date <
                                          new Date(
                                             new Date().setHours(0, 0, 0, 0)
                                          )
                                       }
                                    />
                                 </PopoverContent>
                              </Popover>
                           </div>

                           <div className="flex-1 flex items-end">
                              <Button
                                 type="submit"
                                 className="w-full md:w-auto bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md"
                              >
                                 Search Buses
                              </Button>
                           </div>
                        </form>
                     </CardContent>
                  </Card>
               </div>
            </div>

            <div className="container mx-auto px-4 py-8">
               {searched && (
                  <>
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2 className="text-2xl font-bold">
                           {loading
                              ? "Searching..."
                              : results.length > 0
                              ? `${results.length} Bus${
                                   results.length === 1 ? "" : "es"
                                } Found`
                              : "No Buses Found"}
                        </h2>

                        {results.length > 0 && (
                           <div className="mt-4 md:mt-0 flex items-center">
                              <span className="mr-2 text-sm text-gray-600">
                                 Sort by:
                              </span>
                              <Select
                                 value={sortOrder}
                                 onValueChange={(value) =>
                                    setSortOrder(
                                       value as "price" | "time" | "duration"
                                    )
                                 }
                              >
                                 <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="price">
                                       Price (Low to High)
                                    </SelectItem>
                                    <SelectItem value="time">
                                       Departure Time
                                    </SelectItem>
                                    <SelectItem value="duration">
                                       Duration (Short to Long)
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        )}
                     </div>

                     {loading ? (
                        <div className="flex justify-center py-20">
                           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bus-primary"></div>
                        </div>
                     ) : (
                        <>
                           {results.length > 0 ? (
                              <div className="space-y-4">
                                 {sortedResults.map((bus) => (
                                    <Card
                                       key={bus.id}
                                       className="overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                       <CardContent className="p-0">
                                          <div className="flex flex-col md:flex-row">
                                             <div className="p-6 md:w-1/4 bg-gray-50 flex flex-col justify-center">
                                                <div className="flex items-center space-x-2">
                                                   <Bus className="h-5 w-5 text-bus-primary" />
                                                   <span className="font-semibold">
                                                      {bus.busCompany}
                                                   </span>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                   {bus.busType}
                                                </div>
                                                <div className="mt-3 text-sm">
                                                   <span className="text-green-600 font-medium">
                                                      {bus.seats} seats
                                                      available
                                                   </span>
                                                </div>
                                             </div>

                                             <div className="p-6 md:w-1/2 flex-grow">
                                                <div className="flex items-center justify-between mb-4">
                                                   <div className="text-center">
                                                      <div className="text-2xl font-bold">
                                                         {bus.departureTime}
                                                      </div>
                                                      <div className="text-sm text-gray-500">
                                                         {bus.from}
                                                      </div>
                                                   </div>

                                                   <div className="flex-grow px-4 flex flex-col items-center">
                                                      <div className="text-xs text-gray-500 mb-1">
                                                         {bus.duration}
                                                      </div>
                                                      <div className="w-full flex items-center">
                                                         <div className="h-0.5 bg-gray-300 flex-grow"></div>
                                                         <ArrowRight
                                                            className="mx-1 text-gray-400"
                                                            size={16}
                                                         />
                                                         <div className="h-0.5 bg-gray-300 flex-grow"></div>
                                                      </div>
                                                      <div className="text-xs text-gray-500 mt-1">
                                                         {format(
                                                            bus.departureDate,
                                                            "E, MMM d"
                                                         )}
                                                      </div>
                                                   </div>

                                                   <div className="text-center">
                                                      <div className="text-2xl font-bold">
                                                         {bus.arrivalTime}
                                                      </div>
                                                      <div className="text-sm text-gray-500">
                                                         {bus.to}
                                                      </div>
                                                   </div>
                                                </div>

                                                <div className="flex items-center text-sm text-gray-500">
                                                   <Map className="h-4 w-4 mr-1" />
                                                   <span>View route map</span>
                                                </div>
                                             </div>

                                             <div className="p-6 md:w-1/4 bg-gray-50 flex flex-col justify-center items-center md:items-end">
                                                <div className="text-2xl font-bold text-bus-primary">
                                                   ${bus.price}
                                                </div>
                                                <div className="text-sm text-gray-500 mb-4">
                                                   per person
                                                </div>
                                                <Button asChild>
                                                   <Link
                                                      href={`/booking/${bus.id}`}
                                                   >
                                                      Book Now
                                                   </Link>
                                                </Button>
                                             </div>
                                          </div>
                                       </CardContent>
                                    </Card>
                                 ))}
                              </div>
                           ) : (
                              <div className="text-center py-16">
                                 <div className="text-5xl mb-4">😕</div>
                                 <h3 className="text-xl font-semibold mb-2">
                                    No buses found for your search
                                 </h3>
                                 <p className="text-gray-600 mb-6">
                                    Try changing your search parameters
                                 </p>
                                 <Button
                                    onClick={() => {
                                       setFrom("");
                                       setTo("");
                                       setDate(new Date());
                                       router.push("/search");
                                    }}
                                 >
                                    Clear Search
                                 </Button>
                              </div>
                           )}
                        </>
                     )}
                  </>
               )}
            </div>
         </div>
      </>
   );
};

// Sample bus route data
const mockRoutes: BusRoute[] = [
   {
      id: "1",
      from: "New York",
      to: "Washington",
      departureDate: new Date("2025-05-15"),
      departureTime: "08:00",
      arrivalTime: "11:30",
      duration: "3h 30m",
      price: 45.0,
      seats: 12,
      busCompany: "Express Bus Co.",
      busType: "Luxury Coach",
   },
   {
      id: "2",
      from: "New York",
      to: "Washington",
      departureDate: new Date("2025-05-15"),
      departureTime: "10:00",
      arrivalTime: "13:30",
      duration: "3h 30m",
      price: 39.99,
      seats: 8,
      busCompany: "Express Bus Co.",
      busType: "Standard Coach",
   },
   {
      id: "3",
      from: "Boston",
      to: "New York",
      departureDate: new Date("2025-05-15"),
      departureTime: "09:30",
      arrivalTime: "13:45",
      duration: "4h 15m",
      price: 35.5,
      seats: 15,
      busCompany: "City Liner",
      busType: "Standard Coach",
   },
   {
      id: "4",
      from: "Philadelphia",
      to: "Pittsburgh",
      departureDate: new Date("2025-05-15"),
      departureTime: "12:15",
      arrivalTime: "18:00",
      duration: "5h 45m",
      price: 42.75,
      seats: 20,
      busCompany: "Continental Bus",
      busType: "Premium Coach",
   },
   {
      id: "5",
      from: "Chicago",
      to: "Detroit",
      departureDate: new Date("2025-05-15"),
      departureTime: "14:45",
      arrivalTime: "19:15",
      duration: "4h 30m",
      price: 38.5,
      seats: 6,
      busCompany: "City Liner",
      busType: "Standard Coach",
   },
];

export default SearchPage;
