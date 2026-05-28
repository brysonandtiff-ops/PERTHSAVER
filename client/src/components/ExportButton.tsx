import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileJson, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ExportFormat } from "@/lib/export";

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void | Promise<void>;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  dataTestId?: string;
}

export function ExportButton({
  onExport,
  label = "Export",
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  dataTestId = "button-export",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      await onExport(format);
      toast({
        title: "Export Successful",
        description: `Your data has been exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={disabled || isExporting}
          data-testid={dataTestId}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              {label}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-white/10 w-48">
        <DropdownMenuLabel className="text-white/60">Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          className="text-white hover:bg-white/10 cursor-pointer"
          onClick={() => handleExport("csv")}
          disabled={isExporting}
          data-testid="menu-export-csv"
        >
          <FileText className="h-4 w-4 mr-2 text-green-400" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-white hover:bg-white/10 cursor-pointer"
          onClick={() => handleExport("json")}
          disabled={isExporting}
          data-testid="menu-export-json"
        >
          <FileJson className="h-4 w-4 mr-2 text-purple-400" />
          <span>Export as JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
