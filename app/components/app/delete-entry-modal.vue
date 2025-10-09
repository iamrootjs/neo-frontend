<script lang="ts" setup>
import type { KnowledgeBaseEntry } from '../../../shared/types/knowledgeBase'
import { useKnowledgeBaseStore } from '../../../stores/knowledgeBase'

interface Props {
  isOpen: boolean
  entry: KnowledgeBaseEntry | null
}

interface Emits {
  (e: 'close'): void
  (e: 'deleted'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const config = useRuntimeConfig()
const knowledgeBaseStore = useKnowledgeBaseStore()

const isDeleting = ref(false)

const handleDelete = async () => {
  if (!props.entry) return

  isDeleting.value = true
  
  try {
    await knowledgeBaseStore.deleteKnowledgeBaseEntry(
      config.public.apiBase, 
      props.entry.knowledgeBaseId, 
      props.entry.id
    )
    emit('deleted')
    emit('close')
  } catch (error) {
    console.error('Failed to delete entry:', error)
  } finally {
    isDeleting.value = false
  }
}

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
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-semibold text-red-600">Delete Entry</h2>
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
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div>
              <h3 class="text-lg font-medium text-gray-900">Are you sure?</h3>
              <p class="text-gray-600">This action cannot be undone. This will permanently delete the entry.</p>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-3 mb-4">
            <p class="text-sm font-medium text-gray-700 mb-1">Entry ID:</p>
            <p class="text-sm font-mono text-gray-600">{{ entry.id }}</p>
            <p class="text-sm font-medium text-gray-700 mb-1 mt-2">Content Preview:</p>
            <p class="text-sm text-gray-600 truncate-3-lines">{{ entry.content.substring(0, 150) }}{{ entry.content.length > 150 ? '...' : '' }}</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            @click="handleClose"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            :disabled="isDeleting"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete Entry' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
