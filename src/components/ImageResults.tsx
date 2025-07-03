import { ResultsHeader } from "./ResultsHeader";
import { ImageCard } from "./ImageCard";

interface ImageResultsProps {
  images: Array<{
    id: string;
    name: string;
    alt: string;
    src: string;
  }>;
  onGenerateAll: () => void;
  onGenerateImage: (id: string) => void;
  onSaveImage: (id: string) => void;
}

export function ImageResults({
  images,
  onGenerateAll,
  onGenerateImage,
  onSaveImage,
}: ImageResultsProps) {
  return (
    <div>
      <ResultsHeader imageCount={images.length} onGenerateAll={onGenerateAll} />
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onGenerate={onGenerateImage}
          onSave={onSaveImage}
        />
      ))}
    </div>
  );
}
