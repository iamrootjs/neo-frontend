<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useKnowledgeBaseStore } from '../../stores/knowledgeBase'
import { useChunkStrategyStore } from '../../stores/chunkStrategy'
import type { KnowledgeBaseEntry } from '../../shared/types/knowledgeBase'

// Page metadata
useHead({
  title: 'Vector Search Test - Neo Admin'
})

// Store instances
const knowledgeBaseStore = useKnowledgeBaseStore()
const chunkStrategyStore = useChunkStrategyStore()

// Runtime config
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

// Form data
const selectedKnowledgeBaseId = ref<number | null>(null)
const searchPrompt = ref('')
const threshold = ref(0.7)
const limiter = ref(5)

// Search state
const isSearching = ref(false)
const searchResults = ref<KnowledgeBaseEntry[]>([])
const searchError = ref<string | null>(null)
const lastSearchTime = ref<number | null>(null)
const expandedResults = ref<Set<string>>(new Set())

// Load data on mount
onMounted(async () => {
  await Promise.all([
    knowledgeBaseStore.fetchKnowledgeBases(apiBase),
    chunkStrategyStore.fetchChunkStrategies(apiBase)
  ])
})

// Computed properties
const availableKnowledgeBases = computed(() => knowledgeBaseStore.sortedKnowledgeBases)
const selectedKnowledgeBase = computed(() => 
  availableKnowledgeBases.value.find(kb => kb.id === selectedKnowledgeBaseId.value)
)

const canSearch = computed(() => 
  selectedKnowledgeBaseId.value && searchPrompt.value.trim().length > 0
)

// Search function
const performSearch = async () => {
  if (!canSearch.value) return

  isSearching.value = true
  searchError.value = null
  const startTime = performance.now()

  try {
    const results = await knowledgeBaseStore.searchSimilarEntries(apiBase, {
      prompt: searchPrompt.value.trim(),
      knowledgeBaseId: selectedKnowledgeBaseId.value!,
      threshold: threshold.value,
      limiter: limiter.value
    })

    searchResults.value = results || []
    lastSearchTime.value = performance.now() - startTime
  } catch (error: any) {
    searchError.value = error.message || 'An error occurred during search'
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

// Clear search
const clearSearch = () => {
  searchPrompt.value = ''
  searchResults.value = []
  searchError.value = null
  lastSearchTime.value = null
  expandedResults.value.clear()
}

// Toggle expanded content
const toggleExpanded = (resultId: string) => {
  if (expandedResults.value.has(resultId)) {
    expandedResults.value.delete(resultId)
  } else {
    expandedResults.value.add(resultId)
  }
}

// Check if content should be truncated
const shouldTruncateContent = (content: string) => {
  return content.length > 500
}

// Get truncated content
const getTruncatedContent = (content: string) => {
  if (content.length <= 500) return content
  return content.substring(0, 500) + '...'
}

// Format similarity score as percentage
const formatSimilarity = (score: number) => {
  return (score * 100).toFixed(1) + '%'
}

// Get similarity color based on score
const getSimilarityColor = (score: number) => {
  if (score >= 0.8) return 'text-green-600 bg-green-100'
  if (score >= 0.6) return 'text-blue-600 bg-blue-100'
  if (score >= 0.4) return 'text-yellow-600 bg-yellow-100'
  return 'text-red-600 bg-red-100'
}

// Format markdown content for better display
const formatMarkdownContent = (content: string) => {
  // Basic markdown to HTML conversion
  let formatted = content
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    
    // Headers (must be at start of line)
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-800 mb-2 mt-4 border-b border-gray-200 pb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-800 mb-3 mt-4 border-b border-gray-200 pb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-800 mb-4 mt-4 border-b border-gray-200 pb-2">$1</h1>')
    
    // Info boxes (before other formatting)
    .replace(/\?\?\?\+ info ([^]*?)(?=\n\n|\n#|\n\?\?\?|$)/g, '<div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded-r-md"><div class="flex items-start"><svg class="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg><div class="text-blue-800 text-sm leading-relaxed">$1</div></div></div>')
    .replace(/\?\?\?\+ warning ([^]*?)(?=\n\n|\n#|\n\?\?\?|$)/g, '<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4 rounded-r-md"><div class="flex items-start"><svg class="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg><div class="text-yellow-800 text-sm leading-relaxed">$1</div></div></div>')
    
    // Code blocks (preserve spacing and special chars)
    .replace(/```([^`]*?)```/g, (match, code) => {
      const trimmedCode = code.trim()
      return `<pre class="bg-gray-100 border border-gray-200 p-4 rounded-md text-sm overflow-x-auto my-3 font-mono"><code>${trimmedCode}</code></pre>`
    })
    
    // Links with optional target attributes
    .replace(/\[([^\]]+)\]\(([^)]+)\)(\{[^}]*\})?/g, (match, text, url, attrs) => {
      const isExternal = url.startsWith('http') || attrs?.includes('target="_blank"')
      const target = isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''
      const icon = isExternal ? '<svg class="w-3 h-3 ml-1 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>' : ''
      return `<a href="${url}" ${target} class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-1 py-0.5 rounded transition-colors duration-150">${text}${icon}</a>`
    })
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 border border-gray-200 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic text-gray-700">$1</em>')
    
    // Lists with better spacing
    .replace(/^- (.*$)/gm, '<li class="flex items-start mb-2"><span class="text-blue-500 mr-2 mt-1">•</span><span>$1</span></li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="flex items-start mb-2"><span class="text-blue-500 mr-2 font-medium">$1.</span><span>$2</span></li>')
    
    // Convert line breaks and paragraphs
    .replace(/\n\n+/g, '</div><div class="mb-4">')
    .replace(/\n/g, '<br>')
  
  // Wrap content in a container div
  if (!formatted.startsWith('<h') && !formatted.startsWith('<div') && !formatted.startsWith('<pre')) {
    formatted = `<div class="mb-4">${formatted}</div>`
  }
  
  // Wrap lists in ul tags
  formatted = formatted.replace(/(<li[^>]*>.*?<\/li>)/g, (match) => {
    if (!match.includes('<ul>')) {
      return match
    }
    return match
  })
  
  // Group consecutive list items
  formatted = formatted.replace(/(<li[^>]*>.*?<\/span><\/li>)(\s*<li[^>]*>.*?<\/span><\/li>)*/g, (match) => {
    return `<ul class="list-none space-y-1 my-3">${match}</ul>`
  })
  
  return formatted
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Vector Search Test</h1>
      <p class="text-gray-600">Test vector similarity search across your knowledge bases</p>
    </div>

    <!-- Search Form -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Search Configuration</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-4">
          <!-- Knowledge Base Selection -->
          <div>
            <label for="knowledge-base" class="block text-sm font-medium text-gray-700 mb-2">
              Knowledge Base
            </label>
            <select
              id="knowledge-base"
              v-model="selectedKnowledgeBaseId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="null">Select a knowledge base...</option>
              <option 
                v-for="kb in availableKnowledgeBases" 
                :key="kb.id" 
                :value="kb.id"
              >
                {{ kb.name }}
              </option>
            </select>
            <p v-if="selectedKnowledgeBase" class="text-sm text-gray-500 mt-1">
              {{ selectedKnowledgeBase.description }}
            </p>
          </div>

          <!-- Search Prompt -->
          <div>
            <label for="search-prompt" class="block text-sm font-medium text-gray-700 mb-2">
              Search Prompt
            </label>
            <textarea
              id="search-prompt"
              v-model="searchPrompt"
              rows="4"
              placeholder="Enter your search query here..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-4">
          <!-- Similarity Threshold -->
          <div>
            <label for="threshold" class="block text-sm font-medium text-gray-700 mb-2">
              Similarity Threshold: {{ threshold }}
            </label>
            <input
              id="threshold"
              v-model.number="threshold"
              type="range"
              min="0"
              max="1"
              step="0.01"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.0 (Less Similar)</span>
              <span>1.0 (Most Similar)</span>
            </div>
          </div>

          <!-- Result Limit -->
          <div>
            <label for="limiter" class="block text-sm font-medium text-gray-700 mb-2">
              Max Results
            </label>
            <input
              id="limiter"
              v-model.number="limiter"
              type="number"
              min="1"
              max="50"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>

          <!-- Search Actions -->
          <div class="flex gap-3 pt-4">
            <button
              @click="performSearch"
              :disabled="!canSearch || isSearching"
              class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="isSearching" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
            <button
              @click="clearSearch"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0 || searchError || isSearching" class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Search Results</h2>
        <div class="flex items-center gap-4">
          <div v-if="lastSearchTime" class="text-sm text-gray-500">
            Found {{ searchResults.length }} results in {{ Math.round(lastSearchTime) }}ms
          </div>
          <div v-if="searchResults.length > 0" class="text-sm text-gray-500">
            Similarity threshold: {{ (threshold * 100).toFixed(0) }}%
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isSearching" class="text-center py-8">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-lg text-gray-600">Searching for similar content...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="searchError" class="text-center py-8">
        <div class="inline-flex items-center text-red-600">
          <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <div class="text-lg font-medium">Search Error</div>
            <div class="text-sm">{{ searchError }}</div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="searchResults.length === 0" class="text-center py-8">
        <div class="inline-flex items-center text-gray-500">
          <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <div>
            <div class="text-lg font-medium">No Results Found</div>
            <div class="text-sm">Try adjusting your search criteria or lowering the similarity threshold</div>
          </div>
        </div>
      </div>

      <!-- Results List -->
      <div v-else class="space-y-4">
        <div
          v-for="(result, index) in searchResults"
          :key="result.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-gray-500">#{{ index + 1 }}</span>
              <span 
                :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSimilarityColor(result.similarity || 0)}`"
              >
                {{ formatSimilarity(result.similarity || 0) }} similarity
              </span>
            </div>
            <div v-if="result.metadata?.category" class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {{ result.metadata.category }}
            </div>
          </div>
          
          <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <div 
              v-html="formatMarkdownContent(
                expandedResults.has(result.id) || !shouldTruncateContent(result.content) 
                  ? result.content 
                  : getTruncatedContent(result.content)
              )" 
              class="markdown-content"
            ></div>
            <button
              v-if="shouldTruncateContent(result.content)"
              @click="toggleExpanded(result.id)"
              class="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              {{ expandedResults.has(result.id) ? 'Show Less' : 'Show More' }}
            </button>
          </div>
          
          <div v-if="result.metadata && Object.keys(result.metadata).length > 1" class="mt-3 pt-3 border-t border-gray-100">
            <details class="group">
              <summary class="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                View metadata
              </summary>
              <pre class="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">{{ JSON.stringify(result.metadata, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Section -->
    <div class="mt-8 bg-blue-50 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-blue-800 mb-3">How Vector Search Works</h3>
      <div class="text-blue-700 space-y-2 text-sm">
        <p><strong>Similarity Threshold:</strong> Higher values (closer to 1.0) return only very similar content, while lower values return more diverse results.</p>
        <p><strong>Max Results:</strong> Limits the number of results returned. The system will return the most similar entries up to this limit.</p>
        <p><strong>Search Quality:</strong> Be specific in your prompts for better results. The system compares semantic meaning, not just keyword matching.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown-content {
  line-height: 1.6;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3 {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.markdown-content h1:first-child,
.markdown-content h2:first-child,
.markdown-content h3:first-child {
  margin-top: 0;
}

.markdown-content ul {
  list-style: none;
  margin: 1rem 0;
  padding-left: 0;
}

.markdown-content ol {
  list-style: none;
  margin: 1rem 0;
  padding-left: 0;
}

.markdown-content pre {
  border: 1px solid #e5e7eb;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.markdown-content code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  word-break: break-word;
}

.markdown-content a:hover {
  text-decoration: none;
}

.markdown-content blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6b7280;
  font-style: italic;
}

/* Smooth transitions for expand/collapse */
.markdown-content {
  transition: all 0.3s ease-in-out;
}

/* Better spacing for info boxes */
.markdown-content > div:first-child {
  margin-top: 0;
}

.markdown-content > div:last-child {
  margin-bottom: 0;
}

/* Ensure links are readable */
.markdown-content a {
  word-break: break-word;
}

/* Responsive text sizing */
@media (max-width: 640px) {
  .markdown-content h1 {
    font-size: 1.5rem;
  }
  
  .markdown-content h2 {
    font-size: 1.25rem;
  }
  
  .markdown-content h3 {
    font-size: 1.125rem;
  }
  
  .markdown-content pre {
    font-size: 0.75rem;
    padding: 0.75rem;
  }
  
  .markdown-content code {
    font-size: 0.75rem;
  }
}

/* Improve readability on small screens */
@media (max-width: 480px) {
  .markdown-content {
    font-size: 0.875rem;
  }
}
</style>
