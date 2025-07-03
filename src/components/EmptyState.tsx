import { ImageIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div>
      <div>
        <ImageIcon />
      </div>
      <h3>No Images Found</h3>
      <p>Select images on your canvas and scan to generate alt text</p>
    </div>
  );
}
