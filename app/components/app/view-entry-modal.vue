<script lang="ts" setup>
import type { KnowledgeBaseEntry } from '../../../shared/types/knowledgeBase'

interface Props {
  isOpen: boolean
  entry: KnowledgeBaseEntry | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen && entry" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black bg-opacity-50" 
        @click="handleClose"
      ></div>
      
      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-semibold">View Entry</h2>
          <button 
            @click="handleClose"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Body -->
        <div class="p-6 space-y-4">
          <!-- Entry Info -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label class="block font-medium text-gray-700 mb-1">Entry ID</label>
              <div class="font-mono text-gray-600">{{ entry.id }}</div>
            </div>
            <div v-if="entry.metadata?.category">
              <label class="block font-medium text-gray-700 mb-1">Category</label>
              <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                {{ entry.metadata.category }}
              </span>
            </div>
          </div>
          
          <!-- Content -->
          <div>
            <label class="block font-medium text-gray-700 mb-2">Content</label>
            <div class="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre class="whitespace-pre-wrap text-gray-800 font-sans">{{ entry.content }}</pre>
            </div>
          </div>
          
          <!-- Metadata -->
          <div v-if="entry.metadata && Object.keys(entry.metadata).length > 0">
            <label class="block font-medium text-gray-700 mb-2">Metadata</label>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div v-for="(value, key) in entry.metadata" :key="key">
                  <span class="font-medium text-gray-600">{{ key }}:</span>
                  <span class="ml-2 text-gray-800">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Similarity Score (if available) -->
          <div v-if="entry.similarity !== undefined">
            <label class="block font-medium text-gray-700 mb-1">Similarity Score</label>
            <div class="text-lg font-mono">{{ (entry.similarity * 100).toFixed(2) }}%</div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="flex justify-end p-6 border-t">
          <button
            @click="handleClose"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>