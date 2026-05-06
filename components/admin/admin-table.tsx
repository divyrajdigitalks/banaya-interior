  "use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Column {
  header: string;
  accessorKey: string;
  cell?: (item: any) => React.ReactNode;
  sortable?: boolean;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (item: any) => void;
  pageSize?: number;
}

export function AdminTable({ columns, data, onRowClick, pageSize: initialPageSize = 10 }: AdminTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({ key: '', direction: null });

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <Table className="border-collapse">
          <TableHeader className="bg-[#f8fafd]">
            <TableRow className="hover:bg-transparent border-b border-slate-200">
              {columns.map((column, idx) => (
                <TableHead 
                  key={idx}
                  className={`h-12 px-4 text-[13px] font-semibold text-slate-700 border-r border-slate-200 last:border-r-0`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && (
                        <button 
                          onClick={() => handleSort(column.accessorKey)}
                          className={`p-1 rounded-md transition-colors ${sortConfig.key === column.accessorKey ? 'text-blue-600' : 'text-slate-300 hover:text-slate-500'}`}
                        >
                          <ArrowUpDown size={12} />
                        </button>
                      )}
                    </div>
                    {idx < columns.length - 1 && <MoreVertical size={14} className="text-slate-300" />}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, rowIdx) => (
                  <motion.tr
                    key={item.id || rowIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => onRowClick?.(item)}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    {columns.map((column, colIdx) => (
                      <TableCell 
                        key={colIdx} 
                        className={`px-4 py-3 text-[13px] text-slate-600 font-medium border-r border-slate-100 last:border-r-0`}
                      >
                        {column.cell ? column.cell(item) : item[column.accessorKey]}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length} 
                    className="h-40 text-center text-slate-400 font-medium"
                  >
                    No data found...
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-6 px-6 py-3 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-slate-500 font-medium">Page Size:</span>
          <Select 
            value={pageSize.toString()} 
            onValueChange={(val) => {
              setPageSize(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-20 bg-white border-slate-200 rounded-md text-[13px] font-medium focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 shadow-xl">
              {[10, 20, 50, 100].map(size => (
                <SelectItem key={size} value={size.toString()} className="text-[13px]">{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-[13px] text-slate-500 font-medium">
          {Math.min((currentPage - 1) * pageSize + 1, data.length)} to {Math.min(currentPage * pageSize, data.length)} of {data.length}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 text-slate-400 hover:text-slate-600 disabled:opacity-30"
          >
            <ChevronsLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 text-slate-400 hover:text-slate-600 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </Button>
          
          <div className="px-4 text-[13px] text-slate-700 font-semibold">
            Page {currentPage} of {totalPages || 1}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8 text-slate-400 hover:text-slate-600 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8 text-slate-400 hover:text-slate-600 disabled:opacity-30"
          >
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
