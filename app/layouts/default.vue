<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)

function openModal() {
    console.log("nice")
    showModal.value = true
}

function closeModal() {
    showModal.value = false
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
        
        <app-create-kb-model :show-modal="showModal" @close-modal="closeModal" />
        <app-delete-kb-model :show-modal="showModal" @close-modal="closeModal" />
    </div>
</template>

<style></style>