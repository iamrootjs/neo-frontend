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
    <div class="mx-auto px-4 py-8">
        <main class="min-h-[60vh]">
            <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
                <app-nav-bar @open-modal="openModal" />
                <div class="flex flex-1 overflow-hidden">
                    <app-side-bar />
                    <slot />
                </div>
                <app-create-kb-model :show-modal="showModal" @close-modal="closeModal" />
                <app-delete-kb-model :show-modal="showModal" @close-modal="closeModal" />
            </div>
        </main>
    </div>
</template>

<style></style>