<template>
    <header class="flex flex-wrap items-center justify-between gap-4 px-4 md:px-6 py-4 bg-white border-b shadow-sm">
        <div class="flex items-center gap-3">
            <div class="text-xl md:text-2xl font-semibold">Neo Admin</div>
            <div class="hidden sm:block text-sm text-gray-500">Knowledge Base Manager</div>
        </div>
        <div class="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <input type="text" placeholder="Search KBs, docs..."
                class="flex-1 sm:w-72 md:w-96 px-3 py-2 rounded border text-sm focus:ring-2 focus:ring-blue-500" />
            <button @click="$emit('open-modal')"
                class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">New KB</button>
            <!-- <button class="px-3 py-2 border rounded hover:bg-gray-100 text-sm">Import</button>
            <button class="px-3 py-2 border rounded hover:bg-gray-100 text-sm">Export</button> -->
            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">U</div>
        </div>
    </header>
</template>