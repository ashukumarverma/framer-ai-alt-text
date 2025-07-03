# Quick Setup Guide

> **Note**: Full documentation is available in [README.md](./README.md)

## Prerequisites

- Node.js (v18+)
- Azure account (free tier works)
- Framer Desktop

## Setup Steps

1. **Get Azure API credentials**:

   - Go to [Azure Portal](https://portal.azure.com/)
   - Create Computer Vision resource
   - Copy endpoint and key

2. **Configure environment**:

   ```env
   VITE_AZURE_VISION_ENDPOINT=https://your-resource-name.cognitiveservices.azure.com/
   VITE_AZURE_VISION_KEY=your-32-character-key-here
   ```

3. **Install and run**:

   ```bash
   npm install
   npm run dev
   ```

4. **Add to Framer**:
   - Open Framer Desktop
   - Plugins → Development → Add Plugin
   - URL: `https://localhost:5173`

## Usage

1. Select images on canvas
2. Click "Scan for Images"
3. Click "Generate Alt Text"
4. Edit text if needed
5. Alt text is automatically saved!

For detailed instructions, see [README.md](./README.md).
