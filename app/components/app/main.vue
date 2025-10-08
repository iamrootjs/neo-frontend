<script setup>
const { openModal } = useModal()

const handleDelete = (knowledgeBaseId) => {
    openModal('deleteKB', { id: knowledgeBaseId })
}
</script>

<template>
    <main class="flex-1 p-4 md:p-6 overflow-y-auto">
        <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <app-knowledge-base-list />

            <div class="xl:col-span-2 grid grid-rows-[auto,1fr] gap-6">
                <div
                    class="bg-white border rounded p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <div class="text-xs text-gray-500">Selected KB</div>
                        <div class="text-lg md:text-xl font-semibold">Product Docs KB</div>
                        <div class="text-xs md:text-sm text-gray-500">ID: kb_8a9f... · Updated: Sep 28, 2025</div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button class="px-3 py-2 border rounded text-sm hover:bg-gray-100">View embeddings</button>
                        <!-- <button
                            class="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">Snapshot</button> -->
                        <button @click="handleDelete(123)" class="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600">Delete</button>
                    </div>
                </div>

                <div class="bg-white border rounded p-4 shadow-sm overflow-auto">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <app-editor />

                        <div>
                            <div class="mb-4">
                                <h4 class="font-medium text-sm mb-2">Chunk Strategy</h4>
                                <label class="text-xs text-gray-500">Strategy</label>
                                <select class="w-full border rounded px-2 py-1 text-sm">
                                    <option value="">Select a strategy...</option>
                                    <option value="1">Fixed Size Chunking</option>
                                    <option value="2">Semantic Chunking</option>
                                    <option value="3">Sentence Boundary</option>
                                    <option value="4">Paragraph Chunking</option>
                                    <option value="5">Sliding Window</option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <h4 class="font-medium text-sm mb-2">Options</h4>
                                <div class="text-xs text-gray-500 mb-1">Chunk Size</div>
                                <input type="number" class="w-full border rounded px-2 py-1 text-sm mb-2"
                                    placeholder="500" min="1" max="10000" />
                                <div class="text-xs text-gray-500 mb-1">Chunk Overlap</div>
                                <input type="number" class="w-full border rounded px-2 py-1 text-sm" placeholder="50"
                                    min="0" max="1000" />
                            </div>
                            <div class="mb-4">
                                <h4 class="font-medium text-sm mb-2">Metadata</h4>
                                <label class="text-xs text-gray-500">Name</label>
                                <input class="w-full border rounded px-2 py-1 text-sm mb-2" value="Product Docs KB" />
                                <label class="text-xs text-gray-500">Tags</label>
                                <input class="w-full border rounded px-2 py-1 text-sm" placeholder="product, docs" />
                            </div>
                            <!-- <div>
                                <h4 class="font-medium text-sm mb-2">Activity</h4>
                                <ul class="space-y-2 text-sm text-gray-600">
                                    <li class="border rounded p-2">Sep 28 • Reindexed 120 docs by Alice</li>
                                    <li class="border rounded p-2">Sep 20 • Created KB by Bob</li>
                                    <li class="border rounded p-2">Sep 10 • Snapshot v3.0 by System</li>
                                </ul>
                            </div> -->
                        </div>
                    </div>
                    <!-- <div
                        class="mt-6 border-t pt-4 flex flex-col md:flex-row items-start md:items-center justify-between text-sm text-gray-500 gap-2">
                        <div>Last scan: Sep 28, 2025 · Docs: 3,402 · Vector size: 1536</div>
                        <div class="flex flex-wrap gap-2">
                            <button class="px-3 py-2 border rounded hover:bg-gray-100 text-sm">Download
                                snapshot</button>
                            <button class="px-3 py-2 border rounded hover:bg-gray-100 text-sm">Open in
                                playground</button>
                        </div>
                    </div> -->
                </div>
            </div>
        </section>
    </main>
</template>