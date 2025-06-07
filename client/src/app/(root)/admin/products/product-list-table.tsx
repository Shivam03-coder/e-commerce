"use client";

import type { ProductsDataType } from "@/types/globa";
import { productTableColumns } from "./product-list-table-cols";
import { TableShell } from "@/components/global/table-shell";
import { TableToolbar } from "@/components/global/table-toolbar";
import ExportToExcel from "@/components/global/export-to-excel";
import AddProductsBtn from "./add-product-btn";

function ProductsListTable({ data }: { data: ProductsDataType[] }) {
  return (
    <div className="pt-3">
      <TableShell
        columns={productTableColumns}
        data={data}
        renderToolbar={(table) => <TableToolbar table={table} />}
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
