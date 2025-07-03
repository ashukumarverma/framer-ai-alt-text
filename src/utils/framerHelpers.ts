import { CanvasNode } from "framer-plugin";
import { ImageData } from "../types/index";

/**
 * Checks if a node is an image node
 */
export function isImageNode(node: CanvasNode): boolean {
    const nodeType = (node as unknown as Record<string, unknown>).__class;
    console.log('Checking node type:', nodeType, 'for node:', node);

    // Check for various image node types that Framer might use
    const imageTypes = [
        'ImageNode',
        'Image',
        'WebImageNode',
        'BackgroundImageNode',
        'ComponentNode', // Sometimes images are wrapped in components
        'FrameNode' // Sometimes images are in frames
    ];

    const isImage = imageTypes.includes(nodeType as string);

    // Also check if the node has image properties
    const nodeProps = node as unknown as Record<string, unknown>;
    const hasImageProps = !!(
        nodeProps.image ||
        nodeProps.src ||
        nodeProps.backgroundImage ||
        (nodeProps.fill as Record<string, unknown>)?.image ||
        (nodeProps.background as Record<string, unknown>)?.image
    );

    console.log('Node classification:', {
        type: nodeType,
        isImageType: isImage,
        hasImageProps: hasImageProps,
        finalResult: isImage || hasImageProps
    });

    return isImage || hasImageProps;
}

/**
 * Extracts image data from a Framer node
 */
export function extractImageData(node: CanvasNode): string | null {
    try {
        const imageNode = node as unknown as Record<string, unknown>;

        // Try to get the image source from various possible properties
        const imageSrc = imageNode.image ||
            imageNode.src ||
            imageNode.backgroundImage ||
            (imageNode.fill as Record<string, unknown>)?.image ||
            (imageNode.background as Record<string, unknown>)?.image ||
            null;

        if (imageSrc) {
            // If it's already a data URL, return it
            if (typeof imageSrc === 'string' && imageSrc.startsWith('data:')) {
                return imageSrc;
            }

            // If it's a URL, return it
            if (typeof imageSrc === 'string' && (imageSrc.startsWith('http://') || imageSrc.startsWith('https://'))) {
                return imageSrc;
            }

            // If it's a Framer asset, try to get the URL
            if (typeof imageSrc === 'object' && imageSrc && (imageSrc as Record<string, unknown>).url) {
                return (imageSrc as Record<string, unknown>).url as string;
            }

            // Try to get the src property if it exists
            if (typeof imageSrc === 'object' && imageSrc && (imageSrc as Record<string, unknown>).src) {
                return (imageSrc as Record<string, unknown>).src as string;
            }
        }

        return null;
    } catch (error) {
        console.error('Error extracting image data:', error);
        return null;
    }
}

/**
 * Gets the current alt text from a node
 */
export function getNodeAltText(node: CanvasNode): string {
    try {
        const imageNode = node as unknown as Record<string, unknown>;
        return (imageNode.alt || imageNode.altText || imageNode.title || '') as string;
    } catch {
        return '';
    }
}

/**
 * Sets alt text on a Framer node
 */
export function setNodeAltText(node: CanvasNode, altText: string): boolean {
    try {
        const imageNode = node as unknown as Record<string, unknown>;

        // Try different property names that might work
        if ('alt' in imageNode) {
            (imageNode as Record<string, unknown>).alt = altText;
            return true;
        }

        if ('altText' in imageNode) {
            (imageNode as Record<string, unknown>).altText = altText;
            return true;
        }

        if ('title' in imageNode) {
            (imageNode as Record<string, unknown>).title = altText;
            return true;
        }

        // Try to set it on the node's properties
        if (imageNode.setProperty && typeof imageNode.setProperty === 'function') {
            (imageNode.setProperty as (key: string, value: string) => void)('alt', altText);
            return true;
        }

        // Try to set it directly
        try {
            (imageNode as Record<string, unknown>).alt = altText;
            return true;
        } catch (e) {
            console.warn('Could not set alt text on node:', node, e);
            return false;
        }
    } catch (error) {
        console.error('Error setting alt text:', error);
        return false;
    }
}

/**
 * Filters selection to only include image nodes
 */
export function filterImageNodes(nodes: CanvasNode[]): CanvasNode[] {
    return nodes.filter(isImageNode);
}

/**
 * Converts a selection of nodes to ImageData objects
 */
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

/**
 * Gets the node name for display
 */
export function getNodeDisplayName(node: CanvasNode): string {
    try {
        const nodeAny = node as unknown as Record<string, unknown>;
        return (nodeAny.name || nodeAny.id || 'Unnamed Image') as string;
    } catch {
        return 'Unnamed Image';
    }
}

/**
 * Validates if an image source is accessible
 */
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

/**
 * Converts image URL to base64 data URL for API processing
 */
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