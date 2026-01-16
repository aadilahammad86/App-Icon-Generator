# Development Guide

## Prerequisites
-   Node.js (LTS recommended)
-   npm

## Setup

1.  **Clone & Install**
    ```bash
    git clone <repo-url>
    cd App-Icon-Generator
    npm install
    ```

## Scripts

-   `npm run dev`: Starts the Vite dev server and launches Electron. Hot Module Replacement (HMR) is active.
-   `npm run build`: Compiles the application for production.
-   `npm run dist`: Builds and packages the application (alias for `build`).

## Folder Structure

```
├── dist/               # Compiled Renderer code (Vue)
├── dist-electron/      # Compiled Main Process code
├── electron/           # Source code for Main Process
│   ├── main.ts         # Main process entry
│   └── preload.cjs     # Preload script (unused in current nodeIntegration mode)
├── public/             # Static assets
├── release/            # Final build artifacts (.exe)
├── src/                # Vue Source Code
│   ├── components/     # Vue Components (DropZone)
│   ├── utils/          # Logic (Image Processor)
│   ├── App.vue         # Root component
│   └── main.ts         # UI Entry point
```

## Common Tasks

### Adding a New Resolution
1.  Open `src/utils/imageProcessor.ts`.
2.  Add a new entry to the `androidIcons` or `iosIcons` array:
    ```typescript
    { name: 'icon-new-size.png', size: 128 }
    ```
3.  Rebuild.

### Modifying the UI
1.  Edit `src/components/DropZone.vue` (logic/styles) or `src/App.vue` (layout).
2.  Changes reflect immediately with `npm run dev`.
