import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportToExcelProps {
  data: any[];
  fileName?: string;
  sheetName?: string;
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({
  data,
  fileName = "table-data",
  sheetName = "Sheet1",
}) => {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Button size={"sm"} onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export to Excel
    </Button>
  );
};

export default ExportToExcel;