<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useKnowledgeBaseStore } from '../../../stores/knowledgeBase'
import { useChunkStrategyStore } from '../../../stores/chunkStrategy'
import type { CreateKnowledgeBaseRequest } from '../../../shared/types/knowledgeBase'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const config = useRuntimeConfig()
const knowledgeBaseStore = useKnowledgeBaseStore()
const chunkStrategyStore = useChunkStrategyStore()

// Form data
const form = ref<CreateKnowledgeBaseRequest>({
  name: '',
  description: '',
  chunkingStrategyId: 0
})

const isSubmitting = ref(false)

// Get chunk strategies for the dropdown
const { chunkingStrategies } = storeToRefs(chunkStrategyStore)

onMounted(() => {
  // Fetch chunk strategies if not already loaded
  if (chunkingStrategies.value.length === 0) {
    chunkStrategyStore.fetchStragegies(config.public.apiBase)
  }
})

const handleSubmit = async () => {
  if (!form.value.name || !form.value.description || !form.value.chunkingStrategyId) {
    return
  }

  isSubmitting.value = true
  
  try {
    await knowledgeBaseStore.createKnowledgeBase(config.public.apiBase, form.value)
    
    // Reset form
    form.value = {
      name: '',
      description: '',
      chunkingStrategyId: 0
    }
    
    emit('created')
    emit('close')
  } catch (error) {
    console.error('Failed to create knowledge base:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  // Reset form when closing
  form.value = {
    name: '',
    description: '',
    chunkingStrategyId: 0
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
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-semibold">Create Knowledge Base</h2>
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
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter knowledge base name"
            />
          </div>
          
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what this knowledge base contains"
            ></textarea>
          </div>
          
          <div>
            <label for="chunkingStrategy" class="block text-sm font-medium text-gray-700 mb-1">
              Chunking Strategy *
            </label>
            <select
              id="chunkingStrategy"
              v-model="form.chunkingStrategyId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="0" disabled>Select a chunking strategy</option>
              <option 
                v-for="strategy in chunkingStrategies" 
                :key="strategy.id" 
                :value="strategy.id"
              >
                {{ strategy.name }} - {{ strategy.description }}
              </option>
            </select>
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
              :disabled="isSubmitting || !form.name || !form.description || !form.chunkingStrategyId"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmitting ? 'Creating...' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>