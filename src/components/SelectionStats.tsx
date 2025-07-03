import { ImageIcon } from "lucide-react";

interface SelectionStatsProps {
  selectionCount: number;
}

export function SelectionStats({ selectionCount }: SelectionStatsProps) {
  return (
    <div className="flex items-center justify-between pd-8 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="pd-4 bg-primary rounded-full">
          <ImageIcon className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-black">
            {selectionCount} element selected
          </p>
          <p className="text-xs text-gray-600">Select images to start</p>
        </div>
      </div>
      <span
        className={`pdx-8 pdy-4 text-xs font-medium rounded-full ${
          selectionCount > 0
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {selectionCount > 0 ? "Ready" : "Select"}
      </span>
    </div>
  );
}
