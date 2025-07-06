import { CanvasNode, FrameNode } from "framer-plugin";
import { ImageData } from "../types/index";

/* Checks if a node is an image node */
export function isImageNode(node: CanvasNode): boolean {
    const nodeType = (node as unknown as Record<string, unknown>).__class;
    console.log('Checking node type:', nodeType, 'for node:', node);

    // image is stored as a FrameNode in Framer
    // we check if the node is a FrameNode and if not return false
    if (nodeType !== 'FrameNode') {
        return false;
    }

    // cast node to FrameNode to access its properties
    // and check if it has image-related properties
    const nodeProps = node as FrameNode;

    // image are stored in the backgroundImage property
    // we check if the node has a backgroundImage property
    return !!(
        nodeProps.backgroundImage
    );
}

/* Extracts image data from a Framer node */
export function extractImageData(node: CanvasNode): string | null {
    try {
        const imageNode = node as FrameNode;

        // Try to get the image source from the backgroundImage property
        const imageSrc = imageNode.backgroundImage?.url;

        if (typeof imageSrc === 'string') {
            return imageSrc;
        }

        return null;
    } catch (error) {
        console.error('Error extracting image data:', error);
        return null;
    }
}

/* Gets the current alt text from a node */
export function getNodeAltText(node: CanvasNode): string {
    try {
        const imageNode = node as FrameNode;
        const altText = imageNode.backgroundImage?.altText;
        // console.log('Getting alt text for node:', node, 'Alt text:', altText);
        return altText || '';

    } catch {
        return '';
    }
}


/* Filters selection to only include image nodes */
export function filterImageNodes(nodes: CanvasNode[]): CanvasNode[] {
    return nodes.filter(isImageNode);
}

/* Converts a selection of nodes to ImageData objects */
export function convertNodesToImageData(nodes: CanvasNode[]): ImageData[] {
    return nodes
        .filter(isImageNode)
        .map((node) => {
            const imageSrc = extractImageData(node);
            const altText = getNodeAltText(node);
            const nodeName = getNodeDisplayName(node);

            return {
                id: node.id,
                name: nodeName,
                alt: altText,
                src: imageSrc || '',
                node,
                isGenerating: false,
                error: undefined,
            };
        });
}

/* Gets the node name for display */
export function getNodeDisplayName(node: CanvasNode): string {
    try {
        const nodeAny = node as unknown as Record<string, unknown>;
        return (nodeAny.name || nodeAny.id || 'Unnamed Image') as string;
    } catch {
        return 'Unnamed Image';
    }
}

/* Validates if an image source is accessible */
export async function validateImageSource(src: string): Promise<boolean> {
    if (!src) return false;

    try {
        if (src.startsWith('data:')) {
            // Data URLs should be valid if they exist
            return true;
        }

        if (src.startsWith('http://') || src.startsWith('https://')) {
            // Try to fetch the image to validate it exists
            const response = await fetch(src, { method: 'HEAD' });
            return response.ok;
        }

        return false;
    } catch (error) {
        console.error('Error validating image source:', error);
        return false;
    }
}

/* Converts image URL to base64 data URL for API processing */
export async function convertImageToBase64(imageUrl: string): Promise<string> {
    try {
        if (imageUrl.startsWith('data:')) {
            return imageUrl; // Already base64
        }

        const response = await fetch(imageUrl);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting image to base64:', error);
        throw error;
    }
}