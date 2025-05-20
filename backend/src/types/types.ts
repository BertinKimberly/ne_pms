import { Role } from '@prisma/client';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: Role;
}

export interface SafeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
