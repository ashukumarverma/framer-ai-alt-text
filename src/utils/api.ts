import axios from 'axios';
import { AzureVisionResponse, ApiError } from '../types/index';

// Azure Computer Vision API configuration
const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_VISION_ENDPOINT || '';
const AZURE_API_KEY = import.meta.env.VITE_AZURE_VISION_KEY || '';
const API_VERSION = '3.2';

/**
 * Generates alt text for an image using Azure Computer Vision API
 * @param imageData - Base64 encoded image data or image URL
 * @returns Promise<string> - Generated alt text
 */
export async function generateAltText(imageData: string): Promise<string> {
    if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
        throw new Error('Azure Computer Vision API credentials not configured');
    }

    try {
        console.log('Azure Config:', {
            endpoint: AZURE_ENDPOINT,
            hasKey: !!AZURE_API_KEY,
            keyLength: AZURE_API_KEY.length
        });

        // Check if it's a URL - if so, use the simple method
        const isUrl = imageData.startsWith('http://') || imageData.startsWith('https://');

        if (isUrl) {
            console.log('Using URL-based analysis');
            return await generateAltTextSimple(imageData);
        }

        // For base64 data, try to use it with Azure API
        if (imageData.startsWith('data:')) {
            console.log('Base64 data detected, attempting Azure API call');
            return await generateAltTextWithBase64(imageData);
        }

        // If neither URL nor base64, use fallback
        console.log('Unknown image format, using fallback');
        return await generateAltTextFallback();

    } catch (error) {
        console.error('Error generating alt text with Azure:', error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                error.message;
            const errorCode = error.response?.data?.error?.code ||
                error.response?.status ||
                error.code;

            console.error('Azure API Error Details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: errorMessage,
                code: errorCode
            });

            const apiError: ApiError = {
                message: errorMessage,
                code: errorCode,
            };
            throw apiError;
        }

        throw new Error('Failed to generate alt text with Azure Vision API');
    }
}

/**
 * Fallback function for when Azure API fails
 * @param imageData - Base64 encoded image data
 * @returns Promise<string> - Generated alt text
 */
export async function generateAltTextFallback(): Promise<string> {
    console.log('Using fallback alt text generation');

    // Simple fallback - could be enhanced with other APIs
    const fallbackTexts = [
        'Image content detected',
        'Visual content',
        'Uploaded image',
        'Graphic content',
        'Visual element'
    ];

    // Return a random fallback text
    const randomIndex = Math.floor(Math.random() * fallbackTexts.length);
    return fallbackTexts[randomIndex];
}

/* Test function to validate API connectivity */
export async function testApiConnection(): Promise<boolean> {
    if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
        console.error('Azure credentials not configured');
        return false;
    }

    try {
        console.log('Testing Azure API connection...');
        // Test with a simple, publicly accessible image URL
        const testImageUrl = 'https://picsum.photos/200';
        
        await generateAltTextSimple(testImageUrl);
        console.log('Azure API connection test successful');
        return true;
    } catch (error) {
        console.error('Azure API connection test failed:', error);
        return false;
    }
}

/* Enhanced error handling for API responses */
export function handleApiError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
            case 401:
                return 'Invalid API key. Please check your Azure credentials.';
            case 403:
                return 'Access forbidden. Please check your Azure subscription and permissions.';
            case 429:
                return 'Rate limit exceeded. Please try again later.';
            case 500:
                return 'Azure service error. Please try again later.';
            default:
                return errorData?.error?.message || errorData?.message || error.message || 'Unknown API error';
        }
    }

    return error instanceof Error ? error.message : 'Unknown error occurred';
}

/* Simple URL-based image analysis (fallback method) */
export async function generateAltTextSimple(imageUrl: string): Promise<string> {
    if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
        throw new Error('Azure Computer Vision API credentials not configured');
    }

    try {
        // console.log('Using simple URL-based analysis for:', imageUrl);

        const baseEndpoint = AZURE_ENDPOINT.endsWith('/') ? AZURE_ENDPOINT : `${AZURE_ENDPOINT}/`;
        const endpoint = `${baseEndpoint}vision/v${API_VERSION}/analyze`;

        const response = await axios.post<AzureVisionResponse>(
            endpoint,
            { url: imageUrl },
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
                    'Content-Type': 'application/json',
                },
                params: {
                    visualFeatures: 'Description',
                    language: 'en'
                },
                timeout: 30000,
            }
        );

        console.log('Simple API response:', response.data);

        if (response.data.description?.captions?.length > 0) {
            return response.data.description.captions[0].text;
        } else {
            throw new Error('No description generated');
        }
    } catch (error) {
        console.error('Simple API call failed:', error);
        throw error;
    }
}

/* Generates alt text for base64 image data using Azure Computer Vision API */
export async function generateAltTextWithBase64(base64Data: string): Promise<string> {
    if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
        throw new Error('Azure Computer Vision API credentials not configured');
    }

    try {
        console.log('Using base64 data analysis');

        const baseEndpoint = AZURE_ENDPOINT.endsWith('/') ? AZURE_ENDPOINT : `${AZURE_ENDPOINT}/`;
        const endpoint = `${baseEndpoint}vision/v${API_VERSION}/analyze`;

        // Extract the base64 data without the data URL prefix
        const base64String = base64Data.split(',')[1];
        if (!base64String) {
            throw new Error('Invalid base64 data format');
        }

        // Convert base64 to binary data
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const response = await axios.post<AzureVisionResponse>(
            endpoint,
            bytes,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
                    'Content-Type': 'application/octet-stream',
                },
                params: {
                    visualFeatures: 'Description',
                    language: 'en'
                },
                timeout: 30000,
            }
        );

        console.log('Base64 API response:', response.data);

        if (response.data.description?.captions?.length > 0) {
            return response.data.description.captions[0].text;
        } else {
            throw new Error('No description generated');
        }
    } catch (error) {
        console.error('Base64 API call failed:', error);
        throw error;
    }
}