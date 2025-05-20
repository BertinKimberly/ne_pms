// types/custom.types.ts
import {
   IsInt,
   IsNotEmpty,
   IsDateString,
   IsString,
   IsBoolean,
   IsOptional,
   IsEmail,
   IsEnum,
   IsUUID,
   IsPositive,
   IsNumber,
   MinLength,
   ValidateIf
} from "class-validator";
import { Role, VehicleType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateBookingDto {
   @IsString()
   @IsNotEmpty()
   parkingSlotId: string;

   @IsString()
   @IsNotEmpty()
   vehicleId: string;

   @IsDateString()
   @IsNotEmpty()
   startTime: string;
}

export class ExtendBookingDto {
   @IsString()
   @IsNotEmpty()
   bookingId: string;

   @IsInt()
   @IsNotEmpty()
   additionalHours: number;
}

export class CreateUserDto {
   @IsString()
   @MinLength(2, { message: "First name must be at least 2 characters" })
   firstName: string;

   @IsString()
   @MinLength(2, { message: "Last name must be at least 2 characters" })
   lastName: string;

   @IsEmail({}, { message: "Invalid email address" })
   email: string;

   @IsString()
   @MinLength(8, { message: "Password must be at least 8 characters" })
   password: string;

   @IsOptional()
   @IsEnum(Role, { message: "Invalid user role" })
   role?: Role = Role.USER;
}

export class LoginDto {
   @IsEmail({}, { message: "Invalid email address" })
   email: string;

   @IsString()
   @IsNotEmpty({ message: "Password is required" })
   password: string;
}

export class CreateParkingSlotDto {
   @IsString()
   @IsNotEmpty()
   number: string;
   @IsInt()
   @IsNotEmpty()
   floor: number;
   @IsBoolean()
   @IsOptional()
   isAvailable?: boolean;
}

export interface AuthRequest extends Request {
   user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
   };
}

export class CreateVehicleDto {
   @IsString()
   @MinLength(2, { message: "Plate number must be at least 2 characters" })
   plateNumber: string;

   @IsEnum(VehicleType, { message: "Invalid vehicle type" })
   type: VehicleType;

   @IsUUID("4", { message: "Invalid user ID" })
   userId: string;
}

export class CreateParkingDto {
   @IsString()
   @MinLength(3, { message: "Parking code must be at least 3 characters" })
   code: string;

   @IsString()
   @MinLength(3, { message: "Parking name must be at least 3 characters" })
   name: string;

   @IsString()
   @MinLength(3, { message: "Location must be at least 3 characters" })
   location: string;

   @IsInt()
   @IsPositive({ message: "Total spaces must be a positive integer" })
   totalSpaces: number;

   @IsNumber()
   @IsPositive({ message: "Fee per hour must be a positive number" })
   feePerHour: number;
}

export class ParkingEntryDto {
   @IsUUID("4", { message: "Invalid vehicle ID" })
   vehicleId: string;

   @IsUUID("4", { message: "Invalid parking ID" })
   parkingId: string;

   @IsUUID("4", { message: "Invalid user ID" })
   userId: string;
}

export class ParkingExitDto {
   @IsUUID("4", { message: "Invalid activity ID" })
   id: string;

   @IsOptional()
   @Type(() => Date)
   exitDateTime?: Date = new Date();
}

export class DateRangeDto {
   @IsNotEmpty()
   @Type(() => Date)
   startDate: Date;

   @IsNotEmpty()
   @Type(() => Date)
   @ValidateIf((o) => o.startDate <= o.endDate, { 
      message: "End date must be after start date" 
   })
   endDate: Date;
}
