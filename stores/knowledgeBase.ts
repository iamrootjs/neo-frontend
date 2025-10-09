import { defineStore } from 'pinia'
import type { 
  KnowledgeBase, 
  CreateKnowledgeBaseRequest,
  KnowledgeBaseEntry,
  CreateKnowledgeBaseEntryRequest,
  CompareVectorRequest
} from '../shared/types/knowledgeBase'

export const useKnowledgeBaseStore = defineStore('knowledgeBases', {
  state: () => {
    return {
      // Knowledge Bases
      status: 'idle' as 'idle' | 'pending' | 'error' | 'success',
      knowledgeBases: [] as KnowledgeBase[],
      currentKnowledgeBase: null as KnowledgeBase | null,
      error: null as null | any,
      
      // Knowledge Base Entries
      entriesStatus: 'idle' as 'idle' | 'pending' | 'error' | 'success',
      entries: [] as KnowledgeBaseEntry[],
      entriesError: null as null | any,
      
      // Pagination
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      
      // Search/Filter
      searchQuery: '',
      selectedCategory: '',
    }
  },

  getters: {
    // Knowledge Bases getters
    totalKnowledgeBases: (state) => state.knowledgeBases.length,
    
    sortedKnowledgeBases: (state) => {
      return [...state.knowledgeBases].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    },

    getKnowledgeBaseById: (state) => {
      return (id: number) => state.knowledgeBases.find(kb => kb.id === id)
    },

    // Entries getters
    filteredEntries: (state) => {
      let filtered = [...state.entries]
      
      if (state.searchQuery) {
        filtered = filtered.filter(entry => 
          entry.content.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
      }
      
      if (state.selectedCategory) {
        filtered = filtered.filter(entry => 
          entry.metadata?.category === state.selectedCategory
        )
      }
      
      return filtered
    },

    paginatedEntries(): KnowledgeBaseEntry[] {
      const filtered = this.filteredEntries
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return filtered.slice(start, end)
    },

    totalPages(): number {
      return Math.ceil(this.filteredEntries.length / this.itemsPerPage)
    },

    availableCategories: (state) => {
      const categories = new Set<string>()
      state.entries.forEach(entry => {
        if (entry.metadata?.category) {
          categories.add(entry.metadata.category)
        }
      })
      return Array.from(categories)
    }
  },

  actions: {
    // Knowledge Base CRUD actions
    async fetchKnowledgeBases(apiBase: string) {
      this.status = 'pending'
      this.error = null
      
      try {
        console.log('Fetching knowledge bases from:', `${apiBase}/knowledge/knowledge-bases`)
        const response = await fetch(`${apiBase}/knowledge/knowledge-bases`)
        
        if (!response.ok) {
          throw new Error(`Error fetching knowledge bases: ${response.statusText}`)
        }
        
        const data = await response.json()
        this.knowledgeBases = data.knowledgeBases
        this.status = 'success'
        console.log('Fetched knowledge bases:', this.knowledgeBases)
      } catch (err) {
        this.error = err
        this.status = 'error'
        console.error('Error fetching knowledge bases:', err)
      }
    },

    async createKnowledgeBase(apiBase: string, payload: CreateKnowledgeBaseRequest) {
      this.status = 'pending'
      this.error = null
      
      try {
        const response = await fetch(`${apiBase}/knowledge/knowledge-base`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
          throw new Error(`Error creating knowledge base: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Add the new knowledge base to the store
        if (data.knowledgeBase) {
          this.knowledgeBases.push(data.knowledgeBase)
        }
        
        this.status = 'success'
        return data.knowledgeBase
      } catch (err) {
        this.error = err
        this.status = 'error'
        throw err
      }
    },

    async deleteKnowledgeBase(apiBase: string, id: number) {
      this.status = 'pending'
      this.error = null
      
      try {
        // Note: API doesn't seem to have delete endpoint, but we'll prepare for it
        const response = await fetch(`${apiBase}/knowledge/knowledge-base/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error(`Error deleting knowledge base: ${response.statusText}`)
        }
        
        // Remove from store
        this.knowledgeBases = this.knowledgeBases.filter(kb => kb.id !== id)
        this.status = 'success'
      } catch (err) {
        this.error = err
        this.status = 'error'
        throw err
      }
    },

    async updateKnowledgeBase(apiBase: string, id: number, payload: Partial<CreateKnowledgeBaseRequest>) {
      this.status = 'pending'
      this.error = null
      
      try {
        // Note: API doesn't seem to have update endpoint, but we'll prepare for it
        const response = await fetch(`${apiBase}/knowledge/knowledge-base/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
          throw new Error(`Error updating knowledge base: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Update in store
        const index = this.knowledgeBases.findIndex(kb => kb.id === id)
        if (index !== -1) {
          this.knowledgeBases[index] = { ...this.knowledgeBases[index], ...data.knowledgeBase }
        }
        
        this.status = 'success'
        return data.knowledgeBase
      } catch (err) {
        this.error = err
        this.status = 'error'
        throw err
      }
    },

    // Knowledge Base Entry CRUD actions
    async fetchKnowledgeBaseEntries(apiBase: string, knowledgeBaseId: number) {
      this.entriesStatus = 'pending'
      this.entriesError = null
      
      try {
        console.log(`Fetching entries for KB ${knowledgeBaseId}`)
        
        const response = await fetch(`${apiBase}/knowledge/knowledge-bases/${knowledgeBaseId}/entries`)
        
        if (!response.ok) {
          throw new Error(`Error fetching entries: ${response.statusText}`)
        }
        
        const data = await response.json()
        this.entries = data.entries || []
        this.totalItems = data.pagination?.total || this.entries.length
        this.entriesStatus = 'success'
      } catch (err) {
        this.entriesError = err
        this.entriesStatus = 'error'
        console.error('Error fetching entries:', err)
      }
    },

    async createKnowledgeBaseEntry(apiBase: string, knowledgeBaseId: number, payload: { content: string; metadata?: any; generateEmbedding?: boolean }) {
      this.entriesStatus = 'pending'
      this.entriesError = null
      
      try {
        const response = await fetch(`${apiBase}/knowledge/knowledge-bases/${knowledgeBaseId}/entries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
          throw new Error(`Error creating entry: ${response.statusText}`)
        }
        
        const data = await response.json()
        this.entriesStatus = 'success'
        
        // Add the new entry to the store
        if (data.entry) {
          this.entries.push(data.entry)
          this.totalItems++
        }
        
        return data.entry
      } catch (err) {
        this.entriesError = err
        this.entriesStatus = 'error'
        throw err
      }
    },

    async getKnowledgeBaseEntry(apiBase: string, knowledgeBaseId: number, entryId: string) {
      try {
        const response = await fetch(`${apiBase}/knowledge/knowledge-bases/${knowledgeBaseId}/entries/${entryId}`)
        
        if (!response.ok) {
          throw new Error(`Error fetching entry: ${response.statusText}`)
        }
        
        const data = await response.json()
        return data.entry
      } catch (err) {
        console.error('Error fetching entry:', err)
        throw err
      }
    },

    async updateKnowledgeBaseEntry(apiBase: string, knowledgeBaseId: number, entryId: string, payload: { content?: string; metadata?: any; regenerateEmbedding?: boolean }) {
      this.entriesStatus = 'pending'
      this.entriesError = null
      
      try {
        const response = await fetch(`${apiBase}/knowledge/knowledge-bases/${knowledgeBaseId}/entries/${entryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
          throw new Error(`Error updating entry: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Update in store
        const index = this.entries.findIndex(entry => entry.id === entryId)
        if (index !== -1) {
          this.entries[index] = data.entry
        }
        
        this.entriesStatus = 'success'
        return data.entry
      } catch (err) {
        this.entriesError = err
        this.entriesStatus = 'error'
        throw err
      }
    },

    async deleteKnowledgeBaseEntry(apiBase: string, knowledgeBaseId: number, entryId: string) {
      this.entriesStatus = 'pending'
      this.entriesError = null
      
      try {
        const response = await fetch(`${apiBase}/knowledge/knowledge-bases/${knowledgeBaseId}/entries/${entryId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error(`Error deleting entry: ${response.statusText}`)
        }
        
        // Remove from store
        this.entries = this.entries.filter(entry => entry.id !== entryId)
        this.totalItems--
        this.entriesStatus = 'success'
      } catch (err) {
        this.entriesError = err
        this.entriesStatus = 'error'
        throw err
      }
    },

    async searchSimilarEntries(apiBase: string, payload: CompareVectorRequest) {
      this.entriesStatus = 'pending'
      this.entriesError = null
      
      try {
        const response = await fetch(`${apiBase}/knowledge/compare-vector`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
          throw new Error(`Error searching entries: ${response.statusText}`)
        }
        
        const data = await response.json()
        this.entriesStatus = 'success'
        return data.entries
      } catch (err) {
        this.entriesError = err
        this.entriesStatus = 'error'
        throw err
      }
    },

    // Utility actions
    setCurrentKnowledgeBase(knowledgeBase: KnowledgeBase | null) {
      this.currentKnowledgeBase = knowledgeBase
    },

    setCurrentPage(page: number) {
      this.currentPage = page
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
      this.currentPage = 1 // Reset to first page when searching
    },

    setSelectedCategory(category: string) {
      this.selectedCategory = category
      this.currentPage = 1 // Reset to first page when filtering
    },

    clearFilters() {
      this.searchQuery = ''
      this.selectedCategory = ''
      this.currentPage = 1
    }
  }
})