<script lang="ts" setup>
import type { Task } from '../../shared/types/task';

const { data, error, status } = await useFetch('/api/tasks', { lazy: true });

</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Welcome to Neo Frontend</h1>
    <article v-if="status === 'pending'" aria-busy="true" class="animate-pulse text-gray-500">Loading...</article>
    <article class="text-red-600 font-semibold mb-4" v-if="error">{{ error.statusMessage }}</article>
    <div v-else class="w-full max-w-xl space-y-4">
      <article v-for="task in data" :key="task.id"
        class="bg-white rounded shadow p-4 border border-gray-200 hover:shadow-md transition">{{ task.title }}</article>
    </div>
  </div>
</template>