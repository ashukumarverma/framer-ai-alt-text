import { framer, CanvasNode } from "framer-plugin";
import { useState, useEffect } from "react";
import "./App.css";

import {
  Scan,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  Save,
  Wand2,
} from "lucide-react";

framer.showUI({
  position: "top right",
  width: 350,
  height: 500,
});

function useSelection() {
  const [selection, setSelection] = useState<CanvasNode[]>([]);

  useEffect(() => {
    return framer.subscribeToSelection(setSelection);
  }, []);

  return selection;
}

export function App() {
  const selection = useSelection();
  const [isScanning, setIsScanning] = useState(false);
  const [foundImages, setFoundImages] = useState<
    Array<{
      id: string;
      name: string;
      alt: string;
      src: string;
    }>
  >([]);

  const handleScanImages = () => {
    setIsScanning(true);

    // Log the current selection
    console.log("Starting image scan...");
    console.log("Current selection:", selection);
    console.log("Selection count:", selection.length);

    // Log each selected node
    selection.forEach((node, index) => {
      const nodeWithClass = node as unknown as Record<string, unknown>;
      console.log(`Node ${index + 1}:`, {
        id: node.id,
        type: nodeWithClass.__class || "unknown",
        nodeData: node,
      });
    });

    // Simulate scanning delay
    setTimeout(() => {
      // Create mock image data based on selection
      const mockImages = selection.map((node, index) => {
        const nodeWithClass = node as unknown as Record<string, unknown>;
        const imageData = {
          id: `image-${index}`,
          name: `Image ${index + 1}`,
          alt: "",
          src: "", // actual image data will be populated here
          nodeInfo: {
            id: node.id,
            type: nodeWithClass.__class || "unknown",
            rawNode: node,
          },
        };

        console.log(`Created mock image ${index + 1}:`, imageData);
        return imageData;
      });

      console.log("Scan complete! Found images:", mockImages);
      setFoundImages(mockImages);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <main>
      {/* Header */}
      <div>
        <div>
          <Sparkles />
        </div>
        <div>
          <div>Image Alt Text Generator</div>
        </div>
      </div>

      {/* Content */}
      <div>
        {/* Selection Stats */}
        <div>
          <div>
            <div>
              <div>
                <ImageIcon />
              </div>
              <div>
                <p>
                  {selection.length} element
                  {selection.length !== 1 ? "s" : ""} selected
                </p>
                <p>Select images to start</p>
              </div>
            </div>
            <span>{selection.length > 0 ? "Ready" : "Select"}</span>
          </div>
        </div>

        {/* Scan Button */}
        <button onClick={handleScanImages} disabled={isScanning}>
          {isScanning ? (
            <>
              <Loader2 />
              Scanning...
            </>
          ) : (
            <>
              <Scan />
              Scan for Images
            </>
          )}
        </button>

        {/* Empty State */}
        {foundImages.length === 0 && !isScanning && (
          <div>
            <div>
              <ImageIcon />
            </div>
            <h3>No Images Found</h3>
            <p>Select images on your canvas and scan to generate alt text</p>
          </div>
        )}

        {/* Results */}
        {foundImages.length > 0 && (
          <div>
            {/* Results Header */}
            <div>
              <div>
                <div>
                  <div>
                    <Sparkles />
                  </div>
                  <div>
                    <h4>
                      {foundImages.length} Image
                      {foundImages.length !== 1 ? "s" : ""} Found
                    </h4>
                    <p>Ready for generation</p>
                  </div>
                </div>
                <button>
                  <Wand2 />
                  All
                </button>
              </div>
            </div>

            {/* Image Cards */}
            {foundImages.map((image) => (
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
                  <button>
                    <Wand2 />
                    Generate
                  </button>
                  <button>
                    <Save />
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
