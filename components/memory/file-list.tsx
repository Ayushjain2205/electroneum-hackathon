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

function FileItem({ name, type, size }: FileItemProps) {
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
    <div className="flex items-center p-2 border-b border-gray-200 last:border-b-0">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2"
        style={{ backgroundColor: activeColor }}
      >
        {getIcon()}
      </div>
      <div className="min-w-0 flex-grow">
        <h3 className="text-sm font-medium truncate">{name}</h3>
        <p className="text-xs text-gray-600">{size}</p>
      </div>
    </div>
  );
}

interface FileListProps {
  files: FileItemProps[];
}

export function FileList({ files }: FileListProps) {
  return (
    <div className="border border-black rounded-md overflow-hidden h-[calc(100vh-250px)]">
      <div className="flex flex-col flex-wrap h-full content-start">
        {files.map((file, index) => (
          <div
            key={index}
            className="w-1/2 border-r border-gray-200 last:border-r-0"
          >
            <FileItem {...file} />
          </div>
        ))}
      </div>
    </div>
  );
}
