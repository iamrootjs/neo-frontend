<script setup>
const { activeModal, closeModal, isModalOpen } = useModal()
</script>

<template>
    <Teleport to="body">
        <div v-if="isModalOpen('deleteKB')" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div class="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg">
                <h3 class="text-lg font-semibold mb-1">Knowledge base deletion</h3>
                <p class="text-sm text-gray-500 mb-4">Are you sure you want to delete this knowledge base {{ "TBC" }}}.
                </p>
                <div class="flex justify-end gap-2">
                    <button @click="closeModal"
                        class="px-3 py-2 border rounded hover:bg-gray-100 text-sm">Cancel</button>
                    <button @click="closeModal"
                        class="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-blue-700">Delete</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>