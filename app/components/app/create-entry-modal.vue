<script lang="ts" setup>
import { ref } from 'vue'
import { useKnowledgeBaseStore } from '../../../stores/knowledgeBase'
import type { CreateKnowledgeBaseEntryRequest } from '../../../shared/types/knowledgeBase'

interface Props {
  isOpen: boolean
  knowledgeBaseId: number
}

interface Emits {
  (e: 'close'): void
  (e: 'created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const config = useRuntimeConfig()
const knowledgeBaseStore = useKnowledgeBaseStore()

// Form data
const form = ref<CreateKnowledgeBaseEntryRequest>({
  content: '',
  knowledgeBaseId: props.knowledgeBaseId,
  options: {
    chunkSize: 1000,
    chunkOverlap: 200
  },
  metadata: {
    category: ''
  }
})

const isSubmitting = ref(false)

// Watch for knowledgeBaseId changes
watch(() => props.knowledgeBaseId, (newId) => {
  form.value.knowledgeBaseId = newId
})

const handleSubmit = async () => {
  if (!form.value.content.trim()) {
    return
  }

  isSubmitting.value = true
  
  try {
    // Clean up the form data
    const payload = {
      ...form.value,
      content: form.value.content.trim(),
      metadata: form.value.metadata?.category ? { category: form.value.metadata.category } : undefined
    }
    
    await knowledgeBaseStore.createKnowledgeBaseEntry(config.public.apiBase, payload)
    
    // Reset form
    form.value = {
      content: '',
      knowledgeBaseId: props.knowledgeBaseId,
      options: {
        chunkSize: 1000,
        chunkOverlap: 200
      },
      metadata: {
        category: ''
      }
    }
    
    emit('created')
    emit('close')
  } catch (error) {
    console.error('Failed to create entry:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  // Reset form when closing
  form.value = {
    content: '',
    knowledgeBaseId: props.knowledgeBaseId,
    options: {
      chunkSize: 1000,
      chunkOverlap: 200
    },
    metadata: {
      category: ''
    }
  }
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black bg-opacity-50" 
        @click="handleClose"
      ></div>
      
      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-semibold">Add Knowledge Base Entry</h2>
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
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              id="content"
              v-model="form.content"
              required
              rows="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the content to be added to the knowledge base"
            ></textarea>
          </div>
          
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              id="category"
              v-model="form.metadata!.category"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional category for organizing content"
            />
          </div>
          
          <!-- Advanced Options -->
          <details class="border rounded-md">
            <summary class="px-3 py-2 bg-gray-50 cursor-pointer select-none">
              Advanced Chunking Options
            </summary>
            <div class="p-3 space-y-3">
              <div>
                <label for="chunkSize" class="block text-sm font-medium text-gray-700 mb-1">
                  Chunk Size
                </label>
                <input
                  id="chunkSize"
                  v-model.number="form.options!.chunkSize"
                  type="number"
                  min="100"
                  max="4000"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p class="text-xs text-gray-500 mt-1">Number of characters per chunk (100-4000)</p>
              </div>
              
              <div>
                <label for="chunkOverlap" class="block text-sm font-medium text-gray-700 mb-1">
                  Chunk Overlap
                </label>
                <input
                  id="chunkOverlap"
                  v-model.number="form.options!.chunkOverlap"
                  type="number"
                  min="0"
                  :max="form.options!.chunkSize! / 2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p class="text-xs text-gray-500 mt-1">Number of overlapping characters between chunks</p>
              </div>
            </div>
          </details>
          
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
              {{ isSubmitting ? 'Adding...' : 'Add Entry' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>