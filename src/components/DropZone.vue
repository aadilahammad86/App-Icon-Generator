<script setup lang="ts">
import { ref } from 'vue'
import { ipcRenderer } from 'electron'
import { processImage } from '../utils/imageProcessor'

const isDragging = ref(false)
const isProcessing = ref(false)
const statusMessage = ref('')
const error = ref('')
const successPath = ref('')

const fileInput = ref<HTMLInputElement | null>(null)

const handleDrop = async (e: DragEvent) => {
  isDragging.value = false
  error.value = ''
  successPath.value = ''
  statusMessage.value = ''

  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return

  handleFile(files[0])
}

const handleFileSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  handleFile(files[0])
}

const handleFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    error.value = 'Please drop an image file (PNG/JPG).'
    return
  }

  try {
    isProcessing.value = true
    statusMessage.value = 'Processing image resolutions...'
    
    // Generate Zip Buffer
    const zipBuffer = await processImage(file)
    
    statusMessage.value = 'Saving file...'
    
    // Open Save Dialog
    const filePath = await ipcRenderer.invoke('save-dialog')
    if (!filePath) {
      statusMessage.value = ''
      isProcessing.value = false
      return // User cancelled
    }

    // Save to Disk
    const result = await ipcRenderer.invoke('save-file', filePath, zipBuffer)
    
    if (result.success) {
      statusMessage.value = 'Success!'
      successPath.value = filePath
    } else {
      throw new Error(result.error)
    }

  } catch (err: any) {
    error.value = err.message || 'An unexpected error occurred.'
    console.error(err)
  } finally {
    isProcessing.value = false
    // Reset file input
    if (fileInput.value) fileInput.value.value = ''
  }
}

const openLocation = () => {
  if (successPath.value) {
    ipcRenderer.invoke('show-item-in-folder', successPath.value)
  }
}

const triggerFileInput = () => {
  if (!isProcessing.value) {
    fileInput.value?.click()
  }
}
</script>

<template>
  <div class="container">
    <div
      class="drop-zone"
      :class="{ dragging: isDragging, processing: isProcessing }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFileSelect" 
        accept="image/png, image/jpeg" 
        style="display: none;" 
      />
      <div v-if="isProcessing" class="loading">
        <div class="spinner"></div>
        <p>{{ statusMessage }}</p>
      </div>
      
      <div v-else class="content">
        <div class="icon">📁</div>
        <p class="title">Drag & Drop or Click to Select</p>
        <span class="subtitle">1024x1024 PNG/JPG</span>
      </div>
    </div>

    <div v-if="error" class="message error">
      {{ error }}
    </div>

    <div v-if="successPath" class="message success">
      <p>Icons generated successfully!</p>
      <button @click="openLocation">Open File Location</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 800px;
}

.drop-zone {
  width: 100%;
  flex: 1;
  min-height: 200px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
}


.drop-zone:hover, .drop-zone.dragging {
  border-color: #646cff;
  background: rgba(100, 108, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.drop-zone.processing {
  pointer-events: none;
  border-style: solid;
  border-color: #646cff;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.icon {
  font-size: 4rem;
  opacity: 0.8;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(100, 108, 255, 0.3);
  border-radius: 50%;
  border-top-color: #646cff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
  text-align: center;
  animation: slideIn 0.3s ease;
}

.error {
  background: rgba(255, 70, 70, 0.1);
  color: #ff6b6b;
  border: 1px solid rgba(255, 70, 70, 0.2);
}

.success {
  background: rgba(70, 255, 140, 0.1);
  color: #4ade80;
  border: 1px solid rgba(70, 255, 140, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

button {
  background: #646cff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #535bf2;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
