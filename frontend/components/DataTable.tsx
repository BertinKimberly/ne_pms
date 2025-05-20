"use client";
import { useState } from "react";
import {
   ColumnDef,
   flexRender,
   getCoreRowModel,
   getPaginationRowModel,
   useReactTable,
} from "@tanstack/react-table";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DataTableProps<TData, TValue> {
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
}

export function DataTable<TData, TValue>({
   columns,
   data = [],
}: DataTableProps<TData, TValue>) {
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [pageIndex, setPageIndex] = useState(0);

   // Initialize the table with pagination
   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      state: { pagination: { pageIndex, pageSize: rowsPerPage } },
      onPaginationChange: (updater) => {
         if (typeof updater === "function") {
            const newPagination = updater(table.getState().pagination);
            setPageIndex(newPagination.pageIndex);
            setRowsPerPage(newPagination.pageSize);
         }
      },
   });

   // Calculate total pages based on data length and rows per page
   const totalPages = Math.ceil(data.length / rowsPerPage);

   // Create array of page numbers to display (max 5)
   const getPageNumbers = () => {
      let startPage = Math.max(0, pageIndex - 2);
      const endPage = Math.min(totalPages - 1, startPage + 4);

      if (endPage - startPage < 4) {
         startPage = Math.max(0, endPage - 4);
      }

      return Array.from(
         { length: endPage - startPage + 1 },
         (_, i) => startPage + i
      );
   };

   const pageNumbers = getPageNumbers();

   return (
      <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <Table>
                  <TableHeader>
                     {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                           key={headerGroup.id}
                           className="border-b border-gray-200 dark:border-gray-800"
                        >
                           {headerGroup.headers.map((header) => (
                              <TableHead
                                 key={header.id}
                                 className="bg-gray-50 dark:bg-gray-900 text-sm font-medium text-main dark:text-gray-200 p-4"
                              >
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                         header.column.columnDef.header,
                                         header.getContext()
                                      )}
                              </TableHead>
                           ))}
                        </TableRow>
                     ))}
                  </TableHeader>
                  <TableBody>
                     {table.getRowModel()?.rows?.length ? (
                        table.getRowModel().rows.map((row, i) => (
                           <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              className={`hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                                 i % 2 === 0
                                    ? "bg-white dark:bg-gray-950"
                                    : "bg-gray-50/30 dark:bg-gray-900/30"
                              }`}
                           >
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell
                                    key={cell.id}
                                    className="p-4 text-gray-700 dark:text-gray-300"
                                 >
                                    {flexRender(
                                       cell.column.columnDef.cell,
                                       cell.getContext()
                                    )}
                                 </TableCell>
                              ))}
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell
                              colSpan={columns.length}
                              className="h-32 text-center text-gray-500 dark:text-gray-400"
                           >
                              No results found.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Rows per page selector */}
                  <div className="flex items-center space-x-2">
                     <label
                        htmlFor="rows-per-page"
                        className="text-sm text-gray-600 dark:text-gray-400"
                     >
                        Rows per page:
                     </label>
                     <select
                        id="rows-per-page"
                        className="border border-gray-300 dark:border-gray-700 rounded-md p-1 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-submain dark:focus:ring-main"
                        value={rowsPerPage}
                        onChange={(e) => {
                           setRowsPerPage(Number(e.target.value));
                           setPageIndex(0); // Reset to first page when changing rows per page
                        }}
                     >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                     </select>
                  </div>

                  {/* Data summary */}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                     Showing{" "}
                     {Math.min(pageIndex * rowsPerPage + 1, data.length)} to{" "}
                     {Math.min((pageIndex + 1) * rowsPerPage, data.length)} of{" "}
                     {data.length} entries
                  </div>

                  {/* Pagination */}
                  <Pagination>
                     <PaginationContent>
                        <PaginationItem>
                           <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                 e.preventDefault();
                                 if (table.getCanPreviousPage()) {
                                    table.previousPage();
                                 }
                              }}
                              className={`${
                                 !table.getCanPreviousPage()
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                              } text-submain dark:text-main`}
                              aria-disabled={!table.getCanPreviousPage()}
                           />
                        </PaginationItem>

                        {/* First page if not in view */}
                        {pageNumbers[0] > 0 && (
                           <>
                              <PaginationItem>
                                 <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                       e.preventDefault();
                                       setPageIndex(0);
                                    }}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                 >
                                    1
                                 </PaginationLink>
                              </PaginationItem>
                              {pageNumbers[0] > 1 && (
                                 <PaginationItem>
                                    <PaginationEllipsis />
                                 </PaginationItem>
                              )}
                           </>
                        )}

                        {/* Page numbers */}
                        {pageNumbers.map((pageNum) => (
                           <PaginationItem key={pageNum}>
                              <PaginationLink
                                 href="#"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setPageIndex(pageNum);
                                 }}
                                 className={`${
                                    pageNum === pageIndex
                                       ? "bg-submain text-white hover:bg-main "
                                       : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                 } transition-colors font-medium`}
                              >
                                 {pageNum + 1}
                              </PaginationLink>
                           </PaginationItem>
                        ))}

                        {/* Last page if not in view */}
                        {pageNumbers[pageNumbers.length - 1] <
                           totalPages - 1 && (
                           <>
                              {pageNumbers[pageNumbers.length - 1] <
                                 totalPages - 2 && (
                                 <PaginationItem>
                                    <PaginationEllipsis />
                                 </PaginationItem>
                              )}
                              <PaginationItem>
                                 <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                       e.preventDefault();
                                       setPageIndex(totalPages - 1);
                                    }}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                 >
                                    {totalPages}
                                 </PaginationLink>
                              </PaginationItem>
                           </>
                        )}

                        <PaginationItem>
                           <PaginationNext
                              href="#"
                              onClick={(e) => {
                                 e.preventDefault();
                                 if (table.getCanNextPage()) {
                                    table.nextPage();
                                 }
                              }}
                              className={`${
                                 !table.getCanNextPage()
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                              } text-submain dark:text-main`}
                              aria-disabled={!table.getCanNextPage()}
                           />
                        </PaginationItem>
                     </PaginationContent>
                  </Pagination>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
