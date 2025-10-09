<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useKnowledgeBaseStore } from '../../../stores/knowledgeBase'

const route = useRoute()
const knowledgeBaseStore = useKnowledgeBaseStore()

// Get knowledge base ID from route
const knowledgeBaseId = computed(() => {
    const id = parseInt(route.params.id as string)
    console.log('Simple route - Route params:', route.params)
    console.log('Simple route - Parsed KB ID:', id)
    return id
})

// Get store data
const { currentKnowledgeBase } = storeToRefs(knowledgeBaseStore)

// Load knowledge base
onMounted(() => {
  console.log('=== DYNAMIC ROUTE MOUNTED ===')
  console.log('Simple dynamic route mounted with ID:', knowledgeBaseId.value)
  console.log('Route object:', route)
  console.log('All route params:', route.params)
  
  // Find KB by ID
  const kb = knowledgeBaseStore.getKnowledgeBaseById(knowledgeBaseId.value)
  console.log('Found KB:', kb)
  
  if (kb) {
    knowledgeBaseStore.setCurrentKnowledgeBase(kb)
    console.log('Set current KB:', kb.name)
  } else {
    console.log('KB not found in store')
  }
  
  console.log('=== DYNAMIC ROUTE MOUNT COMPLETE ===')
})

// Also log when the component is created
console.log('=== DYNAMIC ROUTE COMPONENT CREATED ===')
console.log('Initial route params:', route.params)
</script>

<template>
  <!-- VERY PROMINENT TEST INDICATOR -->
  <div class="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
    🚨 DYNAMIC ROUTE IS LOADED! ID: {{ knowledgeBaseId }} 🚨
  </div>
  
  <div class="max-w-6xl mx-auto p-6 mt-16">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <NuxtLink to="/knowledge-bases" class="hover:text-blue-600">Knowledge Bases</NuxtLink>
        <span>></span>
        <span>{{ currentKnowledgeBase?.name || 'Loading...' }}</span>
      </div>
      
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ currentKnowledgeBase?.name || 'Knowledge Base' }}
          </h1>
          <p v-if="currentKnowledgeBase" class="text-gray-600 mt-1">
            {{ currentKnowledgeBase.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Simple content -->
    <div class="bg-white border rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-4">Knowledge Base Details</h2>
      
      <div v-if="currentKnowledgeBase" class="space-y-3">
        <div>
          <span class="font-medium">ID:</span> {{ currentKnowledgeBase.id }}
        </div>
        <div>
          <span class="font-medium">Name:</span> {{ currentKnowledgeBase.name }}
        </div>
        <div>
          <span class="font-medium">Description:</span> {{ currentKnowledgeBase.description }}
        </div>
        <div>
          <span class="font-medium">Chunking Strategy ID:</span> {{ currentKnowledgeBase.chunking_strategy_id }}
        </div>
        <div>
          <span class="font-medium">Created:</span> {{ new Date(currentKnowledgeBase.created_at).toLocaleString() }}
        </div>
        <div>
          <span class="font-medium">Updated:</span> {{ new Date(currentKnowledgeBase.updated_at).toLocaleString() }}
        </div>
      </div>
      
      <div v-else class="text-gray-500">
        <p>Loading knowledge base...</p>
        <p class="text-sm mt-2">Route ID: {{ knowledgeBaseId }}</p>
      </div>
      
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p class="text-sm text-blue-800">
          <strong>✅ Success:</strong> This is a simplified version of the dynamic route. 
          If you can see this page, the routing is working correctly!
        </p>
      </div>
    </div>

    <!-- Debug info -->
    <div class="mt-6 bg-gray-50 border rounded-lg p-4">
      <h3 class="font-semibold mb-2">Debug Information</h3>
      <div class="text-sm space-y-1">
        <div>Route ID: {{ knowledgeBaseId }}</div>
        <div>Current KB in store: {{ currentKnowledgeBase?.name || 'None' }}</div>
        <div>Total KBs in store: {{ knowledgeBaseStore.knowledgeBases.length }}</div>
      </div>
    </div>
  </div>
</template>