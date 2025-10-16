# Figma Plugin with React and Express.js

A Figma plugin built with React (using Vite), Express.js, and TypeScript.

## Project Structure

### Frontend (`/frontend`)
- **React UI** - Built with Vite for fast development
- **Figma Plugin Code** - TypeScript-based plugin logic
- **Single-file output** - All UI code bundled into one HTML file

### Backend (`/backend`)
- **Express.js server** - REST API
- **TypeScript** - Type-safe server code

## Setup

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Build the plugin:
```bash
npm run build
```

4. Import into Figma:
   - Open Figma Desktop
   - Go to Plugins > Development > Import plugin from manifest...
   - Select `frontend/manifest.json`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run start
```

## Usage

1. In Figma, right-click on the canvas
2. Go to Plugins > Development > Hello World Plugin
3. Enter text in the input field
4. Click "Create Text Layer" to add text to your Figma canvas

## Development

- **Frontend**: Uses Vite for fast bundling and React for UI
- **Backend**: Express.js server on port 3000
- **Communication**: Plugin UI communicates with Figma via `parent.postMessage()`

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, TypeScript, ts-node
- **Build**: Vite with single-file plugin for bundling

## Features

- ✅ React-based UI with TypeScript
- ✅ Fast builds with Vite
- ✅ Express.js backend ready for API integration
- ✅ Fully typed with TypeScript
- ✅ Create text layers in Figma from the UI
