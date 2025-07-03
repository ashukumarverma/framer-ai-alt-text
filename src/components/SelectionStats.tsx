import { ImageIcon } from "lucide-react";

interface SelectionStatsProps {
  selectionCount: number;
}

export function SelectionStats({ selectionCount }: SelectionStatsProps) {
  return (
    <div>
      <div>
        <div>
          <div>
            <ImageIcon />
          </div>
          <div>
            <p>
              {selectionCount} element
              {selectionCount !== 1 ? "s" : ""} selected
            </p>
            <p>Select images to start</p>
          </div>
        </div>
        <span>{selectionCount > 0 ? "Ready" : "Select"}</span>
      </div>
    </div>
  );
}
