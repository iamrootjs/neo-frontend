<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useKnowledgeBaseStore } from '../../../stores/knowledgeBase';
import type { KnowledgeBase } from '../../../shared/types/knowledgeBase'
import EditKBModal from './edit-kb-modal.vue';

const config = useRuntimeConfig()
const router = useRouter()

const knowledgeBaseStore = useKnowledgeBaseStore();

// Add a guard to prevent accessing store during unmounting
const isMounted = ref(false)

onMounted(async () => {
    isMounted.value = true
    console.log('The component is now mounted.')
    console.log('Calling store fetch')
    try {
        await knowledgeBaseStore.fetchKnowledgeBases(config.public.apiBase);
    } catch (error) {
        console.error('Failed to fetch knowledge bases:', error)
    }
})

onBeforeUnmount(() => {
    isMounted.value = false
})

const { knowledgeBases, status, error, sortedKnowledgeBases } = storeToRefs(knowledgeBaseStore);

// Actions
const handleKnowledgeBaseClick = async (kb: KnowledgeBase) => {
    if (!isMounted.value) return
    
    console.log('KB clicked:', kb)
    console.log('Navigating to:', `/knowledge-bases/${kb.id}`)
    knowledgeBaseStore.setCurrentKnowledgeBase(kb)
    
    try {
        await router.push(`/knowledge-bases/${kb.id}`)
        console.log('Navigation completed successfully')
    } catch (error) {
        console.error('Navigation failed:', error)
    }
}

const showEditModal = ref(false)
const selectedKB = ref<KnowledgeBase | null>(null)

const handleEdit = (kb: KnowledgeBase, event: Event) => {
    if (!isMounted.value) return
    
    event.stopPropagation()
    selectedKB.value = kb
    showEditModal.value = true
}

const handleDelete = async (kb: KnowledgeBase, event: Event) => {
    if (!isMounted.value) return
    
    event.stopPropagation()
    if (confirm(`Are you sure you want to delete "${kb.name}"?`)) {
        try {
            await knowledgeBaseStore.deleteKnowledgeBase(config.public.apiBase, kb.id)
        } catch (error) {
            console.error('Failed to delete knowledge base:', error)
        }
    }
}

// Modal event handlers
const handleCloseEditModal = () => {
    showEditModal.value = false
    selectedKB.value = null
}

const handleKBUpdated = () => {
    // Refresh the knowledge base list
    knowledgeBaseStore.fetchKnowledgeBases(config.public.apiBase)
}
</script>

<template>
    <!-- Debug component - remove after fixing -->
    <app-debug-config />
    
    <div class="bg-white border rounded-lg p-4 shadow-sm">
        <div class="flex flex-wrap items-center justify-between mb-4">
            <h3 class="font-medium text-lg">Knowledge Bases</h3>
            <div class="text-xs text-gray-500">
                {{ sortedKnowledgeBases.length }} total
            </div>
        </div>
        <div class="space-y-3">
            <div v-if="status === 'pending'">
                <article aria-busy="true">Loading knowledge bases...</article>
            </div>
            <div v-else-if="error">
                <article class="error">{{ error.message || 'Error loading knowledge bases' }}</article>
            </div>

            <div v-else-if="sortedKnowledgeBases.length > 0">
                <div v-for="kb in sortedKnowledgeBases" :key="kb.id"
                    @click="handleKnowledgeBaseClick(kb)"
                    class="p-3 border rounded flex items-start gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div
                        class="w-10 h-10 md:w-12 md:h-12 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                        KB</div>
                    <div class="flex-1 text-sm">
                        <div class="flex items-center justify-between">
                            <div class="font-semibold">
                                {{ kb.name }}
                            </div>
                            <div class="flex gap-2">
                                <button 
                                    @click="handleEdit(kb, $event)"
                                    class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                                    Edit
                                </button>
                                <button 
                                    @click="handleDelete(kb, $event)"
                                    class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div class="text-gray-500 mt-1">{{ kb.description }}</div>
                        <div class="text-xs text-gray-400 mt-1">
                            Updated: {{ new Date(kb.updated_at).toLocaleDateString() }}
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-else class="text-center text-gray-500 py-8">
                No knowledge bases found. Create your first one!
            </div>

            <div v-if="sortedKnowledgeBases.length > 0" class="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-500 gap-2">
                <div>Sort: <select class="ml-2 border rounded px-2 py-1">
                        <option>Updated (newest first)</option>
                        <option>Created (newest first)</option>
                        <option>Name (A-Z)</option>
                    </select></div>
                <div class="text-xs">
                    Showing {{ Math.min(sortedKnowledgeBases.length, 10) }} of {{ sortedKnowledgeBases.length }}
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Modal -->
    <EditKBModal
        v-if="showEditModal && selectedKB"
        :knowledge-base="selectedKB"
        :is-open="showEditModal"
        @close="handleCloseEditModal"
        @updated="handleKBUpdated"
    />
</template>