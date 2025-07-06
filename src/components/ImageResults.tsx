import { ResultsHeader } from "./ResultsHeader";
import { ImageCard } from "./ImageCard";
import { ImageData } from "../types/index";

interface ImageResultsProps {
  images: ImageData[];
  onGenerateAll: () => void;
  onGenerateImage: (id: string) => void;
  onAltTextChange: (id: string, altText: string) => void;
  isGeneratingAll: boolean;
}

export function ImageResults({
  images,
  onGenerateAll,
  onGenerateImage,
  onAltTextChange,
  isGeneratingAll,
}: ImageResultsProps) {
  return (
    <div className="flex flex-col gap-2 pd-10">
      <ResultsHeader
        imageCount={images.length}
        onGenerateAll={onGenerateAll}
        isGeneratingAll={isGeneratingAll}
      />
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onGenerate={onGenerateImage}
          onAltTextChange={onAltTextChange}
        />
      ))}
    </div>
  );
}
