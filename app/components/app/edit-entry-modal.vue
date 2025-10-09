<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useKnowledgeBaseStore } from '../../../stores/knowledgeBase'
import type { KnowledgeBaseEntry, CreateKnowledgeBaseEntryRequest } from '../../../shared/types/knowledgeBase'

interface Props {
  isOpen: boolean
  entry: KnowledgeBaseEntry | null
}

interface Emits {
  (e: 'close'): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const config = useRuntimeConfig()
const knowledgeBaseStore = useKnowledgeBaseStore()

// Form data
const form = ref({
  content: '',
  metadata: {
    category: ''
  }
})

const isSubmitting = ref(false)

// Watch for entry changes to populate form
watch(() => props.entry, (newEntry) => {
  if (newEntry) {
    form.value = {
      content: newEntry.content,
      metadata: {
        category: newEntry.metadata?.category || ''
      }
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!props.entry || !form.value.content.trim()) {
    return
  }

  isSubmitting.value = true
  
  try {
    // Prepare payload for update
    const payload: Partial<CreateKnowledgeBaseEntryRequest> = {
      content: form.value.content.trim(),
      metadata: form.value.metadata.category ? { category: form.value.metadata.category } : undefined
    }
    
    await knowledgeBaseStore.updateKnowledgeBaseEntry(config.public.apiBase, props.entry.id, payload)
    
    emit('updated')
    emit('close')
  } catch (error) {
    console.error('Failed to update entry:', error)
  } finally {
    isSubmitting.value = false
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
      <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-semibold">Edit Entry</h2>
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
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Entry ID (read-only) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Entry ID</label>
            <div class="px-3 py-2 bg-gray-100 border rounded-md text-gray-600 font-mono text-sm">
              {{ entry.id }}
            </div>
          </div>
          
          <!-- Content -->
          <div>
            <label for="editContent" class="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              id="editContent"
              v-model="form.content"
              required
              rows="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the content"
            ></textarea>
          </div>
          
          <!-- Category -->
          <div>
            <label for="editCategory" class="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              id="editCategory"
              v-model="form.metadata.category"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional category for organizing content"
            />
          </div>
          
          <!-- Footer -->
          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !form.content.trim()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmitting ? 'Updating...' : 'Update Entry' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>