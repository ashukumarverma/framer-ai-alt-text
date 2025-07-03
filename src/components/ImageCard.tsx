import { ImageIcon, Wand2, AlertCircle, Loader2 } from "lucide-react";
import { ImageData } from "../types/index";

interface ImageCardProps {
  image: ImageData;
  onGenerate: (id: string) => void;
  onAltTextChange: (id: string, altText: string) => void;
}

export function ImageCard({
  image,
  onGenerate,
  onAltTextChange,
}: ImageCardProps) {
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAltTextChange(image.id, e.target.value);
  };

  return (
    <div className="w-full flex flex-col gap-2 pd-10 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="w-full flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-full">
          <ImageIcon className="w-4 h-4 text-blue-600" />
        </div>
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {image.name}
        </h4>
      </div>

      {/* Show error state if there's an error */}
      {image.error && (
        <div className="flex items-center gap-2 pd-4 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <p className="text-xs text-red-800">{image.error}</p>
        </div>
      )}

      <div className="flex flex-col w-full gap-2">
        <label className="block text-xs font-medium text-black mb-2">
          Alt Text Description
        </label>
        <textarea
          data-image-id={image.id}
          className="bg-primary width-full border border-gray-300 black-text rounded-md text-sm placeholder-gray-400 pd-4"
          placeholder="AI will generate descriptive alt text..."
          value={image.alt}
          onChange={handleTextareaChange}
          rows={3}
          disabled={image.isGenerating}
        />
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onGenerate(image.id)}
          disabled={image.isGenerating || !!image.error}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm rounded-md transition-colors"
        >
          {image.isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate
            </>
          )}
        </button>
      </div>
    </div>
  );
}
