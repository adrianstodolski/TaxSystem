
import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filter?: string;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filter,
  onRowClick
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Update internal filter if prop changes
  React.useEffect(() => {
      if(filter !== undefined) setGlobalFilter(filter);
  }, [filter]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="rounded-xl overflow-hidden border border-white/10 bg-transparent">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-[#E1E1E3]">
            <thead className="bg-black/40 text-zinc-500 text-xs uppercase border-b border-white/10">
                {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                    return (
                        <th
                        key={header.id}
                        className="px-6 py-4 font-semibold cursor-pointer hover:text-white transition-colors select-none"
                        onClick={header.column.getToggleSortingHandler()}
                        >
                        <div className="flex items-center gap-2">
                            {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                            {{
                            asc: <ChevronUp size={14} className="text-[#D4AF37]" />,
                            desc: <ChevronDown size={14} className="text-[#D4AF37]" />,
                            }[header.column.getIsSorted() as string] ?? (
                                header.column.getCanSort() ? <ArrowUpDown size={12} className="opacity-30" /> : null
                            )}
                        </div>
                        </th>
                    );
                    })}
                </tr>
                ))}
            </thead>
            <tbody className="divide-y divide-white/5">
                {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={`transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                    >
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                        </td>
                    ))}
                    </motion.tr>
                ))
                ) : (
                <tr>
                    <td
                    colSpan={columns.length}
                    className="h-24 text-center text-zinc-500"
                    >
                    Brak danych.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-xs text-zinc-500">
            Strona {table.getState().pagination.pageIndex + 1} z {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={16} />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
