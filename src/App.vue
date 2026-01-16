<script setup lang="ts">
import DropZone from './components/DropZone.vue'
</script>

<template>
  <div class="container">
    <h1>App Icon Generator</h1>
    <p>Drop your 1024x1024 icon below to generate assets.</p>
    <DropZone />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden;
}

h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(120deg, #646cff, #42b883);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  margin: 0 0 2rem 0;
  color: rgba(255, 255, 255, 0.6);
}
</style>
