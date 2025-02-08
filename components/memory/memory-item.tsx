import { FileText, CheckSquare, BookOpen, Clock, Pencil } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";

interface MemoryItemProps {
  timestamp: string;
  action: string;
  description: string;
}

export function MemoryItem({
  timestamp,
  action,
  description,
}: MemoryItemProps) {
  const { activeColor } = useMode();

  const getIcon = () => {
    switch (action) {
      case "Stored Document":
        return <FileText className="w-6 h-6" />;
      case "Created Task":
        return <CheckSquare className="w-6 h-6" />;
      case "Added Reference":
        return <BookOpen className="w-6 h-6" />;
      case "Completed Task":
        return <CheckSquare className="w-6 h-6 text-green-500" />;
      case "Updated Document":
        return <Pencil className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-brutal"
        style={{ backgroundColor: activeColor }}
      >
        {getIcon()}
      </div>
      <div className="flex-grow">
        <div className="bg-white border-2 border-black rounded-lg shadow-brutal p-3">
          <div className="flex justify-between items-start mb-1">
            <span className="font-bold text-sm">{action}</span>
            <div className="flex items-center text-xs text-gray-600">
              <Clock className="w-3 h-3 mr-1" />
              {timestamp}
            </div>
          </div>
          <p className="text-xs">{description}</p>
        </div>
      </div>
    </div>
  );
}
