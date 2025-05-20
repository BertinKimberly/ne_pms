"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { Loader } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
;
import { User } from "@/types";
import { useGetAllUsers } from "@/hooks/useAdmin";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];

export default function RecentUsers() {
  const { data: userData, isPending } = useGetAllUsers();

  const recentUsers = useMemo(() => {
    //@ts-ignore
    return userData?.data
      ?.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5) || [];
  }, [userData]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {isPending ? (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin h-5 w-5" />
        </div>
      ) : (
        <DataTable columns={columns} data={recentUsers} />
      )}
    </div>
  );
}
