# Troubleshooting

## Common Issues & Fixes

### 1. `ReferenceError: __dirname is not defined`
-   **Cause**: The project is set to `"type": "module"` (ESM), but `__dirname` is a CommonJS global.
-   **Fix**: Polyfill it in `electron/main.ts`:
    ```typescript
    import { fileURLToPath } from 'url'
    import { dirname } from 'path'
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    ```

### 2. `Cannot read properties of undefined (reading 'showSaveDialog')`
-   **Cause**: The IPC Renderer API is not exposed to the window object correctly. This often happens because the `preload.js` script fails to load or execute in the Electron Sandbox environment, especially when mixing ESM and CJS.
-   **Fix**:
    1.  **Disable Sandbox & Enable Node Integration**: In `electron/main.ts`:
        ```typescript
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            sandbox: false
        }
        ```
    2.  **Import Directly**: In Vue components, import `ipcRenderer` directly:
        ```typescript
        import { ipcRenderer } from 'electron'
        ```

### 3. CSS/Layout Issues on Small Screens
-   **Cause**: Fixed heights (e.g., `height: 400px`) on containers.
-   **Fix**: Use Flexbox with `flex: 1` and `min-height` to allow components to fill available space dynamically.

### 4. Build Failures (Preload Script)
-   **Context**: Vite tries to bundle the preload script as ESM by default.
-   **Fix**: Configure Vite (`vite.config.ts`) to output `cjs` format for the preload script and externalize `electron`.
