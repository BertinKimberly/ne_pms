
export interface User {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
}

export interface ICompany {
   id?: string;
   name: string;
   description?: string;
   adminId: string;
   createdAt?: Date;
   updatedAt?: Date;
}


export interface ISchedule {
   id?: string;
   routeId: string;
   busId: string;
   departure: Date;
   arrival: Date;
   price: number;
   availableSeats?: number;
   createdAt?: Date;
   updatedAt?: Date;
}