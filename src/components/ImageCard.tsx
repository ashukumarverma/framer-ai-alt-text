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
    <div key={image.id}>
      <div>
        <div>
          <ImageIcon />
        </div>
        <h4>{image.name}</h4>
      </div>
      <div>
        <label>Alt Text Description</label>
        <textarea
          placeholder="AI will generate descriptive alt text..."
          defaultValue={image.alt}
        />
      </div>
      <div>
        <button onClick={() => onGenerate(image.id)}>
          <Wand2 />
          Generate
        </button>
        <button onClick={() => onSave(image.id)}>
          <Save />
          Save
        </button>
      </div>
    </div>
  );
}
