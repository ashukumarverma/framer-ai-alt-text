import { CanvasNode } from "framer-plugin";

export interface ImageData {
    id: string;
    name: string;
    alt: string;
    src: string;
    node: CanvasNode;
    isGenerating?: boolean;
    error?: string;
}

export interface AzureVisionResponse {
    description: {
        captions: Array<{
            text: string;
            confidence: number;
        }>;
    };
    requestId: string;
    metadata: {
        width: number;
        height: number;
        format: string;
    };
}

export interface ApiError {
    message: string;
    code?: string;
}