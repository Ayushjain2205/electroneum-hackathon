import {
  FileText,
  File,
  FileSpreadsheet,
  FileIcon as FilePresentation,
} from "lucide-react";
import { useMode } from "@/contexts/ModeContext";

interface FileItemProps {
  name: string;
  type: string;
  size: string;
}

export function FileItem({ name, type, size }: FileItemProps) {
  const { activeColor } = useMode();

  const getIcon = () => {
    switch (type) {
      case "PDF":
        return <FileText className="w-4 h-4" />;
      case "Excel Spreadsheet":
        return <FileSpreadsheet className="w-4 h-4" />;
      case "PowerPoint":
        return <FilePresentation className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-start space-x-2">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-brutal"
        style={{ backgroundColor: activeColor }}
      >
        {getIcon()}
      </div>
      <div className="flex-grow">
        <div className="bg-white border-2 border-black rounded-lg shadow-brutal p-2">
          <div className="font-bold text-sm truncate">{name}</div>
          <div className="text-xs text-gray-600">{size}</div>
        </div>
      </div>
    </div>
  );
}
