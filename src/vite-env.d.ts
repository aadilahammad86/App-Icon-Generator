/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

interface Window {
    ipcRenderer: {
        showSaveDialog: () => Promise<string | null>
        saveFile: (path: string, buffer: ArrayBuffer) => Promise<{ success: boolean; error?: string }>
        showItemInFolder: (path: string) => Promise<void>
    }
}
