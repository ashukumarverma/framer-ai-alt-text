import { framer, CanvasNode } from "framer-plugin";
import { useState, useEffect } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { SelectionStats } from "./components/SelectionStats";
import { ScanButton } from "./components/ScanButton";
import { EmptyState } from "./components/EmptyState";
import { ImageResults } from "./components/ImageResults";

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

  const handleGenerateAll = () => {
    console.log("Generate all alt text");
    // Implement generate all functionality
  };

  const handleGenerateImageAlt = (id: string) => {
    console.log("Generate alt text for image:", id);
    // Implement individual image alt text generation
  };

  const handleSaveImage = (id: string) => {
    console.log("Save alt text for image:", id);
    // Implement save functionality
  };

  return (
    <main>
      <Header />

      <div>
        <SelectionStats selectionCount={selection.length} />
        
        <ScanButton isScanning={isScanning} onScan={handleScanImages} />

        {foundImages.length === 0 && !isScanning && <EmptyState />}

        {foundImages.length > 0 && (
          <ImageResults
            images={foundImages}
            onGenerateAll={handleGenerateAll}
            onGenerateImage={handleGenerateImageAlt}
            onSaveImage={handleSaveImage}
          />
        )}
      </div>
    </main>
  );
}
