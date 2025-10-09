<script setup lang="ts">
import { ref } from 'vue'

const showCreateModal = ref(false)
const showDeleteModal = ref(false)

function openModal() {
    console.log("nice")
    showCreateModal.value = true
}

function closeModal() {
    showCreateModal.value = false
    showDeleteModal.value = false
}
</script>

<template>
    <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
        <app-nav-bar @open-modal="openModal" />
        <div class="flex flex-1 overflow-hidden">
            <app-side-bar />
            <main class="flex-1 overflow-y-auto">
                <slot />
            </main>
        </div>
        
        <app-create-kb-model :show-modal="showCreateModal" @close-modal="closeModal" />
        <app-delete-kb-model :show-modal="showDeleteModal" @close-modal="closeModal" />
    </div>
</template>

<style></style>