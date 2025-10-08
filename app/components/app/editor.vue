<template>
    <div class="md:col-span-2">
        <div class="mb-2 flex justify-between text-sm">
            <span class="font-medium">Editor</span>
            <!-- <span class="text-gray-500">Draft · autosave</span> -->
        </div>
        <textarea rows="10" class="w-full border rounded p-3 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Editor area..."></textarea>
        <div class="mt-3 flex flex-wrap gap-2">
            <button class="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Save &
                Index</button>
            <!-- <button class="px-3 py-2 border rounded hover:bg-gray-100 text-sm">Preview</button>
            <button class="px-3 py-2 border rounded hover:bg-gray-100 text-sm">Re-index</button> -->
        </div>
        <!-- <div class="mt-4 text-sm">
            <h4 class="font-medium mb-2">Versioning</h4>
            <div class="border rounded p-2 text-sm">
                <div class="flex justify-between">
                    <div><strong>v3.1</strong> — Sep 25, 2025</div>
                    <button class="px-2 py-1 border rounded text-xs hover:bg-gray-100">Restore</button>
                </div>
                <p class="text-xs text-gray-500 mt-1">Incremental reindex after adding updated PDFs.
                </p>
            </div>
        </div> -->
    </div>
</template>