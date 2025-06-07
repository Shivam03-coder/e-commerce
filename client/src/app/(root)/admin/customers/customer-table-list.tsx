"use client";

import type { CustomerType, ProductsDataType } from "@/types/global";
import { TableShell } from "@/components/global/table-shell";
import { TableToolbar } from "@/components/global/table-toolbar";
import ExportToExcel from "@/components/global/export-to-excel";
import type { Row } from "@tanstack/react-table";
import { useAppToasts } from "@/hooks/use-app-toast";
import { useDeleteCustomerMutation } from "@/apis/admin-api";
import { customerTableColumns } from "./customer-list-table-cols";

function CustomerListTable({ data }: { data: CustomerType[] }) {
  const { SuccessToast, ErrorToast, WarningToast } = useAppToasts();
  const [deleteCustomer, { isLoading }] = useDeleteCustomerMutation();
  const handleCustomerDelete = async (rows: Row<CustomerType>[]) => {
    const id = rows[0]?.original.id;
    if (!id) {
      WarningToast({
        title: "No customer selected",
        description: "Please select a customer to delete",
      });
      return;
    }

    try {
      const res = await deleteCustomer({ id }).unwrap();
      if (res.status === "success") {
        SuccessToast({
          title: "Customer deleted successfully",
        });
      } else if (res.status === "failed") {
        ErrorToast({
          title: "Failed to delete Customer",
          description: res.message || "Please try again later",
        });
      }
    } catch (error) {
      ErrorToast({
        title: "An error occurred",
      });
      console.error("Customer deletion error:", error);
    }
  };
  return (
    <div className="pt-3">
      <TableShell
        columns={customerTableColumns}
        data={data}
        isLoading={isLoading}
        renderToolbar={(table) => <TableToolbar table={table} />}
        onDelete={handleCustomerDelete}
        addToolbar={
          <div className="flex items-center gap-2">
            <ExportToExcel data={data} fileName="clients" />
          </div>
        }
      />
    </div>
  );
}
export default CustomerListTable;
