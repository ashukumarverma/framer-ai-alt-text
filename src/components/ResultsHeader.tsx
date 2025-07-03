import { Sparkles, Wand2 } from "lucide-react";

interface ResultsHeaderProps {
  imageCount: number;
  onGenerateAll: () => void;
}

export function ResultsHeader({ imageCount, onGenerateAll }: ResultsHeaderProps) {
  return (
    <div>
      <div>
        <div>
          <div>
            <Sparkles />
          </div>
          <div>
            <h4>
              {imageCount} Image
              {imageCount !== 1 ? "s" : ""} Found
            </h4>
            <p>Ready for generation</p>
          </div>
        </div>
        <button onClick={onGenerateAll}>
          <Wand2 />
          All
        </button>
      </div>
    </div>
  );
}
