<script lang="ts" setup>
import { ref } from 'vue'

const sidebar = ref<HTMLElement | null>(null)

function toggleSidebar() {
    sidebar.value?.classList.toggle('hidden')
    sidebar.value?.classList.toggle('fixed')
    sidebar.value?.classList.toggle('inset-0')
    sidebar.value?.classList.toggle('z-40')
}
</script>

<template>
    <aside ref="sidebar" class="hidden lg:block w-64 bg-white border-r p-4 overflow-y-auto transition-all duration-300">
        <div class="text-sm text-gray-500 mb-3">Navigation</div>
        <nav class="flex flex-col gap-2">
            <NuxtLink class="px-3 py-2 rounded hover:bg-gray-100" to="/">Dashboard</NuxtLink>
            <NuxtLink class="px-3 py-2 rounded bg-blue-50 border-l-4 border-blue-600" :to="{ name: 'knowledge-bases' }">
                Knowledge Bases
            </NuxtLink>
            <nuxt-link class="px-3 py-2 rounded hover:bg-gray-100" :to="{ name: 'test' }">Data Sources</nuxt-link>
        </nav>

        <!-- <div class="mt-8 text-xs text-gray-500">Filters</div>
        <div class="mt-2 flex flex-col gap-2">
            <select class="px-2 py-2 border rounded text-sm">
                <option>All sources</option>
                <option>Uploads</option>
                <option>Web Crawl</option>
                <option>Vector DB</option>
            </select>
        </div> -->
    </aside>

    <!-- TODO move to a more reasonable place -->
    <div class="lg:hidden fixed bottom-4 right-4 z-20">
        <button @click="toggleSidebar"
            class="bg-blue-600 text-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center hover:bg-blue-700">
            ☰
        </button>
    </div>
</template>
