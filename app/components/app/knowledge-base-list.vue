<script lang="ts" setup>
import { defineStore } from 'pinia'
import type { ChunkStrategy } from '../../../shared/types/chunkStrategy';
const config = useRuntimeConfig()

const { data, error, status } = await useFetch(`${config.public.apiBase}/knowledge/chunk-strategies`);
const strategies = data.strategies

// const { data, error, status } = await useFetch('/api/knowledgeBase', { lazy: true });
// const strategies = data

console.log(data)
</script>

<template>
    <div class="bg-white border rounded-lg p-4 shadow-sm">
        <div class="flex flex-wrap items-center justify-between mb-4">
            <h3 class="font-medium text-lg">Knowledge Bases</h3>
            <div class="text-xs text-gray-500">Showing 1–10 of 42</div>
        </div>

        <div class="space-y-3">
            <div v-if="status === 'pending'">
                <article aria-busy="true">Loading...</article>
            </div>
            <div v-else-if="error">
                <article class="error">{{ error.statusMessage }}</article>
            </div>

            <div v-else-if="strategies">
                <div v-for="kb in strategies" :key="kb.id"
                    class="p-3 border rounded flex items-start gap-3 hover:bg-gray-50 cursor-pointer">
                    <div
                        class="w-10 h-10 md:w-12 md:h-12 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                        KB</div>
                    <div class="flex-1 text-sm">
                        <div class="flex items-center justify-between">
                            <div class="font-semibold">
                                {{ kb.name }}
                            </div>
                        </div>
                        <div class="text-gray-500">{{ kb.description }}</div>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-500 gap-2">
                <div>Sort: <select class="ml-2 border rounded px-2 py-1">
                        <option>Updated</option>
                        <option>Created</option>
                    </select></div>
                <div class="flex items-center gap-2"><button class="px-2 py-1 border rounded">Prev</button><button
                        class="px-2 py-1 border rounded">Next</button></div>
            </div>
        </div>
    </div>
</template>