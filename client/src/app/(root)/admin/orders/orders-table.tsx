"use client";

import type { OrdersType } from "@/types/global";
import { TableShell } from "@/components/global/table-shell";
import { TableToolbar } from "@/components/global/table-toolbar";
import ExportToExcel from "@/components/global/export-to-excel";
import { orderTableColumns } from "./order-table-cols";
import type { Order } from "@/apis/types/admin";

function OrdersListTable({ data }: { data: Order[] }) {
  return (
    <div className="pt-3">
      <TableShell
        columns={orderTableColumns}
        data={data}
        renderToolbar={(table) => <TableToolbar table={table} />}
        addToolbar={
          <div className="flex items-center gap-2">
            <ExportToExcel data={data} fileName="clients" />
          </div>
        }
      />
    </div>
  );
}
export default OrdersListTable;
