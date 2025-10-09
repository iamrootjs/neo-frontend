<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useKnowledgeBaseStore } from '../../../stores/knowledgeBase'
import { useChunkStrategyStore } from '../../../stores/chunkStrategy'
import type { KnowledgeBase, CreateKnowledgeBaseRequest } from '../../../shared/types/knowledgeBase'

// Props
interface Props {
  knowledgeBase: KnowledgeBase
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  updated: []
}>()

const knowledgeBaseStore = useKnowledgeBaseStore()
const chunkStrategyStore = useChunkStrategyStore()
const config = useRuntimeConfig()

// Get stores state
const { status } = storeToRefs(knowledgeBaseStore)
const { chunkingStrategies } = storeToRefs(chunkStrategyStore)

// Form state
const form = ref<CreateKnowledgeBaseRequest>({
  name: '',
  description: '',
  chunkingStrategyId: 1
})

const errors = ref<{[key: string]: string}>({})
const isSubmitting = ref(false)

// Initialize form with knowledge base data
watch(() => props.knowledgeBase, (kb) => {
  if (kb) {
    form.value = {
      name: kb.name,
      description: kb.description,
      chunkingStrategyId: kb.chunking_strategy_id
    }
  }
}, { immediate: true })

// Load chunk strategies if not already loaded
if (chunkingStrategies.value.length === 0) {
  chunkStrategyStore.fetchChunkStrategies(config.public.apiBase)
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
  }
  
  if (!form.value.description.trim()) {
    errors.value.description = 'Description is required'
  }
  
  if (!form.value.chunkingStrategyId) {
    errors.value.chunkingStrategyId = 'Chunking strategy is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    await knowledgeBaseStore.updateKnowledgeBase(
      config.public.apiBase, 
      props.knowledgeBase.id, 
      form.value
    )
    
    // Emit updated event and close modal
    emit('updated')
    emit('close')
  } catch (error) {
    console.error('Error updating knowledge base:', error)
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
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Edit Knowledge Base</h2>
            <button
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              :class="[
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              ]"
              placeholder="Enter knowledge base name"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Description Field -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              :class="[
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              ]"
              placeholder="Enter knowledge base description"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          </div>

          <!-- Chunking Strategy Field -->
          <div>
            <label for="chunkingStrategy" class="block text-sm font-medium text-gray-700 mb-1">
              Chunking Strategy *
            </label>
            <select
              id="chunkingStrategy"
              v-model="form.chunkingStrategyId"
              :class="[
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.chunkingStrategyId ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              ]"
            >
              <option value="" disabled>Select a chunking strategy</option>
              <option 
                v-for="strategy in chunkingStrategies" 
                :key="strategy.id" 
                :value="strategy.id"
              >
                {{ strategy.name }}
              </option>
            </select>
            <p v-if="errors.chunkingStrategyId" class="mt-1 text-sm text-red-600">{{ errors.chunkingStrategyId }}</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Updating...' : 'Update Knowledge Base' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
