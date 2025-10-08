<script setup lang="ts">
defineProps<{ showModal: boolean }>()
defineEmits(['close-modal'])
</script>

<template>
    <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div class="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg">
                <h3 class="text-lg font-semibold mb-1">Create Knowledge Base</h3>
                <p class="text-sm text-gray-500 mb-4">Provide a Name, description and chunk strategy.</p>
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-3 mb-4">
                    <input placeholder="Name" class="px-2 py-2 border rounded text-sm" />
                    <input placeholder="Description" class="px-2 py-2 border rounded text-sm" />
                    <select class="px-2 py-2 border rounded text-sm">
                        <option>Chunk Strategy</option>
                        <option>{{"TBC"}}</option>
                    </select>

                </div>
                <div class="flex justify-end gap-2">
                    <button @click="$emit('close-modal')"
                        class="px-3 py-2 border rounded hover:bg-gray-100 text-sm">Cancel</button>
                    <button class="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Create</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>