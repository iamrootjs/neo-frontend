<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useKnowledgeBaseStore } from '../../../stores/knowledgeBase'
import type { KnowledgeBaseEntry } from '../../../shared/types/knowledgeBase'
import CreateEntryModal from '../../components/app/create-entry-modal.vue'
import EditEntryModal from '../../components/app/edit-entry-modal.vue'
import ViewEntryModal from '../../components/app/view-entry-modal.vue'
import DeleteEntryModal from '../../components/app/delete-entry-modal.vue'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const knowledgeBaseStore = useKnowledgeBaseStore()

// Get knowledge base ID from route
const knowledgeBaseId = computed(() => {
    const id = parseInt(route.params.id as string)
    return isNaN(id) ? null : id
})

// Get store data
const { 
  currentKnowledgeBase, 
  knowledgeBases, 
  paginatedEntries,
  entriesStatus,
  currentPage,
  totalPages,
  searchQuery,
  selectedCategory,
  availableCategories
} = storeToRefs(knowledgeBaseStore)

// Page metadata - moved after store data is available
useHead({
  title: computed(() => `${currentKnowledgeBase.value?.name || 'Knowledge Base'} - Neo Admin`)
})

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)
const selectedEntry = ref<KnowledgeBaseEntry | null>(null)

// Load knowledge base and entries
onMounted(async () => {
  // Validate the ID
  if (!knowledgeBaseId.value) {
    console.error('Invalid knowledge base ID')
    await router.push('/knowledge-bases')
    return
  }
  
  // If store is empty, fetch knowledge bases first
  if (knowledgeBases.value.length === 0) {
    await knowledgeBaseStore.fetchKnowledgeBases(config.public.apiBase)
  }
  
  // Find KB by ID
  const kb = knowledgeBaseStore.getKnowledgeBaseById(knowledgeBaseId.value)
  
  if (kb) {
    knowledgeBaseStore.setCurrentKnowledgeBase(kb)
    // Fetch entries for this knowledge base
    await knowledgeBaseStore.fetchKnowledgeBaseEntries(config.public.apiBase, knowledgeBaseId.value)
  } else {
    await router.push('/knowledge-bases')
    return
  }
})

// Entry actions
const handleCreateEntry = () => {
  showCreateModal.value = true
}

const handleViewEntry = (entry: KnowledgeBaseEntry) => {
  selectedEntry.value = entry
  showViewModal.value = true
}

const handleEditEntry = (entry: KnowledgeBaseEntry) => {
  selectedEntry.value = entry
  showEditModal.value = true
}

const handleDeleteEntry = (entry: KnowledgeBaseEntry) => {
  selectedEntry.value = entry
  showDeleteModal.value = true
}

// Modal event handlers
const onEntryCreated = async () => {
  if (knowledgeBaseId.value) {
    await knowledgeBaseStore.fetchKnowledgeBaseEntries(config.public.apiBase, knowledgeBaseId.value)
  }
}

const onEntryUpdated = async () => {
  if (knowledgeBaseId.value) {
    await knowledgeBaseStore.fetchKnowledgeBaseEntries(config.public.apiBase, knowledgeBaseId.value)
  }
}

const onEntryDeleted = async () => {
  if (knowledgeBaseId.value) {
    await knowledgeBaseStore.fetchKnowledgeBaseEntries(config.public.apiBase, knowledgeBaseId.value)
  }
}

// Pagination
const handlePageChange = (page: number) => {
  knowledgeBaseStore.setCurrentPage(page)
}

// Search and filter
const handleSearch = (query: string) => {
  knowledgeBaseStore.setSearchQuery(query)
}

const handleCategoryFilter = (category: string) => {
  knowledgeBaseStore.setSelectedCategory(category)
}

// Format content preview
const getContentPreview = (content: string) => {
  return content.length > 200 ? content.substring(0, 200) + '...' : content
}

// Format date
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Invalid date'
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-6">
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <NuxtLink to="/knowledge-bases" class="hover:text-blue-600 transition-colors">
          Knowledge Bases
        </NuxtLink>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <span class="text-gray-700">{{ currentKnowledgeBase?.name || 'Loading...' }}</span>
      </nav>
      
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ currentKnowledgeBase?.name || 'Knowledge Base' }}
          </h1>
          <p v-if="currentKnowledgeBase" class="text-gray-600 text-lg">
            {{ currentKnowledgeBase.description }}
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <button
            @click="handleCreateEntry"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Entry
          </button>
        </div>
      </div>
    </div>

    <!-- Knowledge Base Info Card -->
    <div v-if="currentKnowledgeBase" class="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Knowledge Base ID</h3>
          <p class="mt-1 text-lg font-semibold text-gray-900">{{ currentKnowledgeBase.id }}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Chunking Strategy</h3>
          <p class="mt-1 text-lg font-semibold text-gray-900">{{ currentKnowledgeBase.chunking_strategy_id }}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Last Updated</h3>
          <p class="mt-1 text-lg font-semibold text-gray-900">{{ formatDate(currentKnowledgeBase.updated_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Entries Section -->
    <div class="bg-white rounded-lg shadow-sm border">
      <!-- Header with search and filters -->
      <div class="border-b p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 class="text-xl font-semibold text-gray-900">Entries</h2>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search -->
            <div class="relative">
              <input
                type="text"
                :value="searchQuery"
                @input="handleSearch(($event.target as HTMLInputElement).value)"
                placeholder="Search entries..."
                class="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            <!-- Category filter -->
            <select
              :value="selectedCategory"
              @change="handleCategoryFilter(($event.target as HTMLSelectElement).value)"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option v-for="category in availableCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            
            <!-- Clear filters -->
            <button
              v-if="searchQuery || selectedCategory"
              @click="knowledgeBaseStore.clearFilters()"
              class="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="entriesStatus === 'pending'" class="p-12 text-center">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-lg text-gray-600">Loading entries...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="entriesStatus === 'error'" class="p-12 text-center">
        <div class="inline-flex items-center text-red-600">
          <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <div class="text-lg font-medium">Error Loading Entries</div>
            <div class="text-sm">Please try again later</div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedEntries.length === 0" class="p-12 text-center">
        <div class="inline-flex items-center text-gray-500">
          <svg class="w-12 h-12 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <div>
            <div class="text-xl font-medium">No Entries Found</div>
            <div class="text-sm mt-1">
              {{ searchQuery || selectedCategory ? 'Try adjusting your search criteria' : 'Add your first entry to get started' }}
            </div>
            <button
              v-if="!searchQuery && !selectedCategory"
              @click="handleCreateEntry"
              class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add First Entry
            </button>
          </div>
        </div>
      </div>

      <!-- Entries List -->
      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="(entry, index) in paginatedEntries"
          :key="entry.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-sm font-medium text-gray-500">
                  #{{ ((currentPage - 1) * 10) + index + 1 }}
                </span>
                <span 
                  v-if="entry.metadata?.category"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ entry.metadata.category }}
                </span>
              </div>
              
              <div class="mb-3">
                <p class="text-gray-800 leading-relaxed">
                  {{ getContentPreview(entry.content) }}
                </p>
              </div>
              
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span class="font-mono">ID: {{ entry.id }}</span>
                <span>{{ entry.content.length }} characters</span>
              </div>
            </div>
            
            <div class="flex items-center gap-2 ml-4">
              <button
                @click="handleViewEntry(entry)"
                class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Entry"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
              
              <button
                @click="handleEditEntry(entry)"
                class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Edit Entry"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              
              <button
                @click="handleDeleteEntry(entry)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Entry"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="border-t p-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing page {{ currentPage }} of {{ totalPages }}
          </div>
          
          <div class="flex items-center gap-2">
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div class="flex items-center gap-1">
              <button
                v-for="page in Math.min(totalPages, 5)"
                :key="page"
                @click="handlePageChange(page)"
                :class="`px-3 py-2 text-sm rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`"
              >
                {{ page }}
              </button>
              
              <span v-if="totalPages > 5" class="px-3 py-2 text-sm text-gray-500">...</span>
            </div>
            
            <button
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CreateEntryModal
      :is-open="showCreateModal"
      :knowledge-base-id="knowledgeBaseId || 0"
      @close="showCreateModal = false"
      @created="onEntryCreated"
    />

    <ViewEntryModal
      :is-open="showViewModal"
      :entry="selectedEntry"
      @close="showViewModal = false"
    />

    <EditEntryModal
      :is-open="showEditModal"
      :entry="selectedEntry"
      @close="showEditModal = false"
      @updated="onEntryUpdated"
    />

    <DeleteEntryModal
      :is-open="showDeleteModal"
      :entry="selectedEntry"
      @close="showDeleteModal = false"
      @deleted="onEntryDeleted"
    />
  </div>
</template>

<style scoped>
.truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions for hover effects */
.hover\:bg-gray-50:hover {
  transition: background-color 0.15s ease-in-out;
}

.hover\:bg-blue-50:hover,
.hover\:bg-green-50:hover,
.hover\:bg-red-50:hover {
  transition: all 0.15s ease-in-out;
}

/* Custom scrollbar for better UX */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>