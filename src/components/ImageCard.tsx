import { ImageIcon, Wand2, Save } from "lucide-react";

interface ImageCardProps {
  image: {
    id: string;
    name: string;
    alt: string;
    src: string;
  };
  onGenerate: (id: string) => void;
  onSave: (id: string) => void;
}

export function ImageCard({ image, onGenerate, onSave }: ImageCardProps) {
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

      <div className="flex flex-col w-full gap-2">
        <label className=" block text-xs font-medium text-gray-700 mb-2">
          Alt Text Description
        </label>
        <textarea
          className="bg-primary width-full border border-gray-300 rounded-md text-sm placeholder-gray-400"
          placeholder="AI will generate descriptive alt text..."
          defaultValue={image.alt}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onGenerate(image.id)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Generate
        </button>
        <button
          onClick={() => onSave(image.id)}
          className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 text-sm rounded-md transition-colors"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  );
}
