import React, { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
  keyExtractor?: (row: T, index: number) => string | number;
}

export function DataTable<T>({
  columns,
  data,
  emptyMessage = "No records found.",
  className,
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} scope="col" className={cn("px-5 py-3.5", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={keyExtractor ? keyExtractor(row, rowIdx) : rowIdx}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={cn("px-5 py-4 align-middle", col.className)}>
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? "")
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
