"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

interface Column {
  header: string;
  accessorKey: string;
  cell?: (item: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (item: any) => void;
}

export function AdminTable({ columns, data, onRowClick }: AdminTableProps) {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-charcoal/5 border border-charcoal/5 overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <Table>
          <TableHeader className="bg-warm-cream/50">
            <TableRow className="border-charcoal/5 hover:bg-transparent">
              {columns.map((column, idx) => (
                <TableHead 
                  key={idx}
                  className="h-16 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, rowIdx) => (
                <motion.tr
                  key={item.id || rowIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIdx * 0.05 }}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-charcoal/5 hover:bg-warm-cream/30 transition-colors cursor-pointer group`}
                >
                  {columns.map((column, colIdx) => (
                    <TableCell 
                      key={colIdx} 
                      className="px-8 py-4 text-sm font-medium text-charcoal"
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
                  className="h-32 text-center text-charcoal/30 font-medium italic"
                >
                  No data found...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
