import { Loader2 } from "lucide-react";

interface ResultsHeaderProps {
  imageCount: number;
  onGenerateAll: () => void;
  isGeneratingAll: boolean;
}

export function ResultsHeader({
  imageCount,
  onGenerateAll,
  isGeneratingAll,
}: ResultsHeaderProps) {
  return (
    <div className="flex flex-col w-full items-center justify-between pd-10 bg-white border-b border-gray-200">
      <h4 className="flex items-center text-sm font-medium text-gray-900">
        {imageCount} Image{imageCount !== 1 ? "s" : ""} Found
      </h4>
      <button
        onClick={onGenerateAll}
        disabled={isGeneratingAll}
        className="flex items-center gap-2 pd-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
      >
        {isGeneratingAll ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            Generate All Alt Text
            <span className="inline-block w-2 h-2 bg-white rounded-full"></span>
          </>
        )}
      </button>
    </div>
  );
}
