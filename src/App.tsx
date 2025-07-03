import { framer, CanvasNode } from "framer-plugin";
import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { SelectionStats } from "./components/SelectionStats";
import { ScanButton } from "./components/ScanButton";
import { EmptyState } from "./components/EmptyState";
import { ImageResults } from "./components/ImageResults";
import { ImageData } from "./types/index";
import {
  filterImageNodes,
  convertNodesToImageData,
  setNodeAltText,
  validateImageSource,
} from "./utils/framerHelpers";
import {
  generateAltText,
  generateAltTextFallback,
  testApiConnection,
  handleApiError,
} from "./utils/api";

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
  const [foundImages, setFoundImages] = useState<ImageData[]>([]);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // Test API connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const connected = await testApiConnection();
        setApiConnected(connected);
        if (!connected) {
          console.warn(
            "API connection test failed. Alt text generation may not work."
          );
        }
      } catch (error) {
        console.error("Error testing API connection:", error);
        setApiConnected(false);
      }
    };

    testConnection();
  }, []);

  const handleScanImages = useCallback(async () => {
    setIsScanning(true);
    setFoundImages([]);

    try {
      console.log("Starting image scan...");
      console.log("Current selection:", selection);

      // Filter to only image nodes
      const imageNodes = filterImageNodes(selection);
      console.log("Found image nodes:", imageNodes.length);

      if (imageNodes.length === 0) {
        console.log("No image nodes found in selection");
        setFoundImages([]);
        setIsScanning(false);
        return;
      }

      // Convert to ImageData objects
      const imageDataArray = convertNodesToImageData(imageNodes);

      // Validate image sources
      const validatedImages = await Promise.all(
        imageDataArray.map(async (imageData) => {
          const isValid = await validateImageSource(imageData.src);
          return {
            ...imageData,
            error:
              !isValid && imageData.src
                ? "Image source not accessible"
                : undefined,
          };
        })
      );

      console.log("Scan complete! Found images:", validatedImages);
      setFoundImages(validatedImages);
    } catch (error) {
      console.error("Error during image scan:", error);
      setFoundImages([]);
    } finally {
      setIsScanning(false);
    }
  }, [selection]);

  const generateAltTextForImage = useCallback(
    async (imageData: ImageData): Promise<string> => {
      if (!imageData.src) {
        throw new Error("No image source available");
      }

      try {
        // Use the original image source directly for API calls
        // The API function will handle URL vs base64 logic internally
        return await generateAltText(imageData.src);
      } catch (error) {
        console.warn("Azure API failed:", error);

        try {
          // Use fallback method
          return await generateAltTextFallback();
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
          throw new Error(handleApiError(error));
        }
      }
    },
    []
  );

  const handleGenerateAll = useCallback(async () => {
    setIsGeneratingAll(true);

    try {
      const updatedImages = [...foundImages];

      for (let i = 0; i < updatedImages.length; i++) {
        const imageData = updatedImages[i];

        // Skip if already has alt text or has an error
        if (imageData.alt.trim() || imageData.error) {
          continue;
        }

        // Update state to show this image is generating
        setFoundImages((prev) =>
          prev.map((img) =>
            img.id === imageData.id
              ? { ...img, isGenerating: true, error: undefined }
              : img
          )
        );

        try {
          const altText = await generateAltTextForImage(imageData);

          // Update the image data
          updatedImages[i] = {
            ...imageData,
            alt: altText,
            isGenerating: false,
            error: undefined,
          };

          // Update state
          setFoundImages((prev) =>
            prev.map((img) =>
              img.id === imageData.id
                ? {
                    ...img,
                    alt: altText,
                    isGenerating: false,
                    error: undefined,
                  }
                : img
            )
          );
        } catch (error) {
          console.error(
            `Error generating alt text for image ${imageData.id}:`,
            error
          );

          updatedImages[i] = {
            ...imageData,
            isGenerating: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to generate alt text",
          };

          // Update state with error
          setFoundImages((prev) =>
            prev.map((img) =>
              img.id === imageData.id
                ? {
                    ...img,
                    isGenerating: false,
                    error:
                      error instanceof Error
                        ? error.message
                        : "Failed to generate alt text",
                  }
                : img
            )
          );
        }
      }
    } catch (error) {
      console.error("Error in generate all:", error);
    } finally {
      setIsGeneratingAll(false);
    }
  }, [foundImages, generateAltTextForImage]);

  const handleGenerateImageAlt = useCallback(
    async (id: string) => {
      const imageData = foundImages.find((img) => img.id === id);
      if (!imageData) return;

      // Update state to show generating
      setFoundImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, isGenerating: true, error: undefined } : img
        )
      );

      try {
        const altText = await generateAltTextForImage(imageData);

        // Update state with generated alt text
        setFoundImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? { ...img, alt: altText, isGenerating: false, error: undefined }
              : img
          )
        );
      } catch (error) {
        console.error(`Error generating alt text for image ${id}:`, error);

        // Update state with error
        setFoundImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  isGenerating: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Failed to generate alt text",
                }
              : img
          )
        );
      }
    },
    [foundImages, generateAltTextForImage]
  );

  const handleSaveImage = useCallback(
    (id: string) => {
      const imageData = foundImages.find((img) => img.id === id);
      if (!imageData) return;

      try {
        // Get the current alt text from the textarea
        const textareaElement = document.querySelector(
          `textarea[data-image-id="${id}"]`
        ) as HTMLTextAreaElement;
        const currentAltText = textareaElement
          ? textareaElement.value
          : imageData.alt;

        // Update the Framer node with the alt text
        const success = setNodeAltText(imageData.node, currentAltText);

        if (success) {
          // Update local state
          setFoundImages((prev) =>
            prev.map((img) =>
              img.id === id ? { ...img, alt: currentAltText } : img
            )
          );

          console.log(`Alt text saved for image ${id}: "${currentAltText}"`);

          // Show success feedback
          framer.notify(`Alt text saved for ${imageData.name}`, {
            variant: "success",
          });
        } else {
          throw new Error("Failed to update node alt text");
        }
      } catch (error) {
        console.error(`Error saving alt text for image ${id}:`, error);
        framer.notify(`Failed to save alt text for ${imageData?.name}`, {
          variant: "error",
        });
      }
    },
    [foundImages]
  );

  const handleAltTextChange = useCallback((id: string, newAltText: string) => {
    setFoundImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, alt: newAltText } : img))
    );
  }, []);

  return (
    <main>
      <Header />
      <div className="w-full flex flex-col pd-10">
        <div className="flex flex-col gap-2">
          <SelectionStats selectionCount={selection.length} />

          <ScanButton isScanning={isScanning} onScan={handleScanImages} />

          {apiConnected === false && (
            <div className="pd-10 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                ⚠️ API connection test failed. Please check your API
                configuration.
              </p>
            </div>
          )}

          {foundImages.length === 0 && !isScanning && <EmptyState />}

          {foundImages.length > 0 && (
            <ImageResults
              images={foundImages}
              onGenerateAll={handleGenerateAll}
              onGenerateImage={handleGenerateImageAlt}
              onSaveImage={handleSaveImage}
              onAltTextChange={handleAltTextChange}
              isGeneratingAll={isGeneratingAll}
            />
          )}
        </div>
      </div>
    </main>
  );
}
