# Framer AI Alt Text Plugin

An intelligent Framer plugin that automatically detects images on your canvas and generates descriptive alt text using Azure Computer Vision API. This plugin helps improve accessibility by providing meaningful alt text for your images.

## What This Plugin Does

This plugin solves the accessibility problem by automatically generating descriptive alt text for images in your Framer designs. It:

1. **Scans your canvas** for all images
2. **Analyzes each image** using AI (Azure Computer Vision)
3. **Generates descriptive text** like "a man wearing glasses" or "a building with a dome roof"
4. **Applies the alt text** directly to your image nodes in Framer
5. **Allows manual editing** if you want to customize the descriptions

## 🎬 **Video Demonstration & Implementation**

**Watch the complete walkthrough showing how the plugin works and technical implementation:**

<div align="center">

[![Watch Demo Video](https://img.shields.io/badge/🎥_WATCH_DEMO-Click_to_View_Video-FF0000?style=for-the-badge&labelColor=000000&color=FF0000)](https://drive.google.com/file/d/1gwupPeTX5OHtJyusO1hDG0D5hn5HyH2m/view?usp=sharing)

**[🔗 Click here to watch the full demonstration video](https://drive.google.com/file/d/1gwupPeTX5OHtJyusO1hDG0D5hn5HyH2m/view?usp=sharing)**

</div>

> **📺 Video Content:**
>
> - ✅ **Live Plugin Demo** - See it working in Framer
> - ✅ **Technical Deep Dive** - Code architecture and implementation
> - ✅ **API Integration** - Azure Computer Vision setup and usage
> - ✅ **Development Process** - Problem-solving approach and best practices

---

## 🚀 Features

- **Auto Image Detection**: Automatically scans your Framer canvas for images
- **AI-Generated Alt Text**: Uses Azure Computer Vision API to generate descriptive alt text
- **Manual Editing**: Edit generated alt text to match your needs
- **Batch Processing**: Generate alt text for multiple images at once
- **Error Handling**: Graceful fallbacks and comprehensive error handling
- **Modern UI**: Clean, responsive interface with loading states

## Prerequisites

Make sure you have:

- **Node.js** (v18 or higher) installed
- **npm** package manager
- **Azure account** (free tier works fine)

## Complete Setup Guide

### Step 1: Get Azure Computer Vision API

1. Go to [Azure Portal](https://portal.azure.com/)
2. Create a new account (free tier available)
3. Create a new **Computer Vision** resource:
   - Click "Create a resource"
   - Search for "Computer Vision"
   - Choose pricing tier (Free F0 or as per your wish)
4. Once created, go to your resource and copy:
   - **Endpoint** (looks like: `https://your-resource-name.cognitiveservices.azure.com/`)
   - **Key** (32-character string)

### Step 2: Install and Configure

1. **Clone/Download the project**:

   ```bash
   git clone git@github.com:ashukumarverma/framer-ai-alt-text.git
   cd framer-ai-alt-text
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Edit the `.env` file in the root directory:

   ```env
   VITE_AZURE_VISION_ENDPOINT=https://your-resource-name.cognitiveservices.azure.com/
   VITE_AZURE_VISION_KEY=your-32-character-key-here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   You should see: `Local: https://localhost:5173/`

### Step 3: Add Plugin to Framer

1. Open **Framer Desktop**
2. Go to **Plugins** → **Development** → **Add Plugin**
3. Enter the URL: `https://localhost:5173`
4. The plugin should now appear in your plugins panel

## 🔧 How the Plugin Works

### 1. Image Detection Process

The plugin uses the Framer Plugin API to:

- Access your canvas nodes
- Filter for image-containing nodes (ImageNode, components with images, etc.)
- Extract image sources (URLs, base64 data, Framer assets)
- Validate image accessibility

```typescript
// Example: How we detect images
const imageNodes = selection.filter((node) => {
  return (
    node.type === "ImageNode" ||
    node.properties?.image ||
    node.background?.image
  );
});
```

### 2. AI Integration Process

When you click "Generate Alt Text":

1. **Image Analysis**: Sends image to Azure Computer Vision API
2. **API Processing**: Azure analyzes the image content
3. **Response Handling**: Receives descriptive text with confidence score
4. **Error Handling**: Falls back to generic text if API fails

```typescript
// Example API call
const response = await axios.post(
  "https://your-endpoint.cognitiveservices.azure.com/vision/v3.2/analyze",
  { url: imageUrl },
  {
    headers: { "Ocp-Apim-Subscription-Key": apiKey },
    params: { visualFeatures: "Description" },
  }
);
```

### 3. Canvas Integration

The plugin directly modifies your Framer nodes:

- Updates the `alt` property of image nodes
- Changes are immediately visible in Framer
- No need to manually save or export

## 📁 Project Structure

```
framer-ai-alt-text/
├── src/
│   ├── App.tsx                # Main plugin component
│   ├── components/            # UI components
│   │   ├── Header.tsx         # Plugin header
│   │   ├── ScanButton.tsx     # Scan trigger button
│   │   ├── ImageCard.tsx      # Individual image display
│   │   ├── ImageResults.tsx   # List of found images
│   │   └── ...
│   ├── utils/
│   │   ├── api.ts             # Azure API integration
│   │   └── framerHelpers.ts   # Framer-specific utilities
│   └── types/
│       └── index.ts           # TypeScript definitions
├── .env                       # Environment variables
├── package.json               # Dependencies and scripts
├── framer.json                # Framer plugin configuration
└── vite.config.ts             # Build configuration
```

## 🎮 Using the Plugin

### Basic Usage

1. **Open your Framer project**
2. **Select images** on your canvas (click and drag to select multiple)
3. **Open the plugin** from the plugins panel
4. **Click "Scan for Images"** - plugin will find all images in your selection
5. **Click "Generate Alt Text"** for individual images or "Generate All"
6. **Edit the text** if needed by clicking on it
7. **Alt text is automatically saved** to your image nodes

### Advanced Features

- **Batch Processing**: Select multiple images and use "Generate All"
- **Manual Editing**: Click any generated text to edit it
- **Error Recovery**: Plugin provides fallback text if API fails
- **Real-time Updates**: Changes are immediately applied to your canvas

## Functional Coverage

### What the Plugin Does

- **Detects Images**: Finds all image nodes on your canvas
- **Supports Multiple Formats**: URLs, base64, Framer assets
- **Updates Canvas**: Directly modifies image nodes in Framer
- **Handles Errors**: Graceful fallbacks for API failures
- **Async Processing**: Non-blocking UI with loading states
- **Type Safety**: Full TypeScript support

### API Integration

- **Azure Computer Vision v3.2**: Latest stable API
- **Proper Authentication**: Secure API key handling
- **Rate Limiting**: Respects API limits
- **Error Handling**: Comprehensive error coverage
- **Timeout Handling**: 30-second timeout for requests

### Code Quality

- **Modular Architecture**: Separated concerns (API, UI, Framer integration)
- **TypeScript**: Full type safety and IntelliSense
- **Async/Await**: Modern JavaScript patterns
- **Error Boundaries**: Graceful error handling
- **Clean Code**: Well-commented and readable

## Troubleshooting

### Common Issues

1. **"Azure credentials not configured"**

   - Check your `.env` file has correct endpoint and key
   - Ensure no extra spaces or quotes

2. **"Image not found" errors**

   - Make sure you've selected images on the canvas
   - Try refreshing the plugin

3. **API timeout errors**

   - Check your internet connection
   - Verify Azure service status

4. **Plugin not loading in Framer**
   - Ensure dev server is running (`npm run dev`)
   - Check that you're using `https://localhost:5173` or may be there could be different `PORT` assigned on your PC

### Debug Mode

Open browser DevTools (F12) to see detailed logs:

- Image detection process
- API calls and responses
- Error details

## 🔗 API Reference

### Environment Variables

```env
VITE_AZURE_VISION_ENDPOINT=your-endpoint-url
VITE_AZURE_VISION_KEY=your-api-key
```

### Main Functions

- `generateAltText(imageData)`: Generates alt text for image
- `isImageNode(node)`: Checks if node contains image
- `setNodeAltText(node, text)`: Updates alt text on canvas

## 📚 Additional Resources

- **Framer Plugin API**: https://www.framer.com/developers/plugins/
- **Azure Computer Vision**: https://docs.microsoft.com/azure/cognitive-services/computer-vision/
