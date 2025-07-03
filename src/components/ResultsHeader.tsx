interface ResultsHeaderProps {
  imageCount: number;
  onGenerateAll: () => void;
}

export function ResultsHeader({
  imageCount,
  onGenerateAll,
}: ResultsHeaderProps) {
  return (
    <div className="flex flex-col w-full items-center justify-between pd-10 bg-white border-b border-gray-200">
      <h4 className="flex items-center text-sm font-medium text-gray-900">
        {imageCount} Image Found
      </h4>
      <button
        onClick={onGenerateAll}
        className="flex-1 items-center gap-2 pd-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
      >
        Generate All Alt Text
        <span className="inline-block w-2 h-2 bg-white rounded-full"></span>
      </button>
    </div>
  );
}
