# Desktop App Icon Generator

A clean, modern desktop application built with **Electron**, **Vue 3**, and **Vite** that generates all required App Icon resolutions for Android and iOS from a single 1024x1024 master image.

![App Screenshot](./docs/screenshot.png) (Add a screenshot here later)

## Features

-   **Drag & Drop Interface**: Simply drag your master icon onto the drop zone.
-   **Auto-Resizing**: Uses `pica` and `canvas` to generate high-quality downscaled images.
-   **Comprehensive Export**: Generates:
    -   **Android**: Mipmap folders (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`, `1024`).
    -   **iOS**: Standard App Store sizes (`20pt`, `29pt`, `40pt`, `60pt`, `76pt`, `83.5pt`, `1024pt`).
-   **Zip Packaging**: Bundles everything into a clean `AppIcons.zip` file.
-   **Native Experience**: Uses native system save dialogs and file explorers.
-   **Responsive UI**: Modern dark-themed UI that adapts to window resizing.

## Tech Stack

-   **Frontend**: Vue 3 + TypeScript + Vite
-   **Backend**: Electron (Main Process)
-   **Build Tool**: Electron Builder
-   **Libraries**: `jszip`, `pica`

## Getting Started / Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/aadilahammad86/App-Icon-Generator.git
    cd App-Icon-Generator
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run in Development Mode**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```
    The output executable will be in the `release/` directory.

## Documentation

For more detailed information, please check the `docs/` folder:

-   [Architecture Overview](docs/ARCHITECTURE.md)
-   [Development Guide](docs/DEVELOPMENT.md)
-   [Troubleshooting](docs/TROUBLESHOOTING.md)

## License

MIT
