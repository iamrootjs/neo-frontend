<script setup lang="ts">
import { ref } from 'vue'

console.log('=== KNOWLEDGE BASES INDEX PAGE LOADED ===')

const showCreateModal = ref(false)

const handleCreateKnowledgeBase = () => {
  showCreateModal.value = true
}

const handleModalClose = () => {
  showCreateModal.value = false
}

const handleKnowledgeBaseCreated = () => {
  showCreateModal.value = false
  // The store will automatically update the list
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Knowledge Bases</h1>
      <button 
        @click="handleCreateKnowledgeBase"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        + Create Knowledge Base
      </button>
    </div>
    
    <app-knowledge-base-list />
    
    <app-create-kb-modal 
      :is-open="showCreateModal"
      @close="handleModalClose"
      @created="handleKnowledgeBaseCreated"
    />
  </div>
</template>
