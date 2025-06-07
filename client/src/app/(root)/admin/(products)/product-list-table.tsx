"use client";

import type { ProductsDataType } from "@/types/global";
import { productTableColumns } from "./product-list-table-cols";
import { TableShell } from "@/components/global/table-shell";
import { TableToolbar } from "@/components/global/table-toolbar";
import ExportToExcel from "@/components/global/export-to-excel";
import AddProductsBtn from "./add-product-btn";
import type { Row } from "@tanstack/react-table";
import { useAppToasts } from "@/hooks/use-app-toast";
import { useDeleteProductsMutation } from "@/apis/admin-api";

function ProductsListTable({ data }: { data: ProductsDataType[] }) {
  const { SuccessToast, ErrorToast, WarningToast } = useAppToasts();
  const [deleteProduct, { isLoading }] = useDeleteProductsMutation();
  const handleProductDelete = async (rows: Row<ProductsDataType>[]) => {
    const id = rows[0]?.original.id;
    if (!id) {
      WarningToast({
        title: "No product selected",
        description: "Please select a product to delete",
      });
      return;
    }

    try {
      const res = await deleteProduct({ id }).unwrap();
      if (res.status === "success") {
        SuccessToast({
          title: "Product deleted successfully",
        });
      } else if (res.status === "failed") {
        ErrorToast({
          title: "Failed to delete product",
          description: res.message || "Please try again later",
        });
      }
    } catch (error) {
      ErrorToast({
        title: "An error occurred",
      });
      console.error("Product deletion error:", error);
    }
  };
  return (
    <div className="pt-3">
      <TableShell
        columns={productTableColumns}
        data={data}
        isLoading={isLoading}
        renderToolbar={(table) => <TableToolbar table={table} />}
        onDelete={handleProductDelete}
        addToolbar={
          <div className="flex items-center gap-2">
            <AddProductsBtn />
            <ExportToExcel data={data} fileName="clients" />
          </div>
        }
      />
    </div>
  );
}
export default ProductsListTable;
