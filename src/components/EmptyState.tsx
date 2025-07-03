import { ImageIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 text-center shadow-sm rounded-lg bg-white border border-gray-200 p-10">
      <div className="mb-3 p-2 bg-blue-50 rounded-full pd-10">
        <ImageIcon className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        No Images Found
      </h3>
      <p className="text-gray-600 text-xs max-w-xs">
        Select images on your canvas and scan to generate alt text
      </p>
    </div>
  );
}
