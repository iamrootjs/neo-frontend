<script lang="ts" setup>
const config = useRuntimeConfig()

import type { ChunkStrategy } from '../../shared/types/chunkStrategy';

// const { data, status, error, refresh, clear } = await useAsyncData(
//   'KB-strat',
//   () => $fetch(`${config.public.apiBase}/knowledge/chunk-strategies`),
// )

// const { data, error, status } = await useFetch<ChunkStrategy[]>(`${config.public.apiBase}/knowledge/chunk-strategies`);
// console.log(data.value)
</script>

<template>
  <div>
    <h1>Knowledge base strategies</h1>
    <!-- <div v-if="status === 'pending'">
      <article aria-busy="true">Loading...</article>
    </div>
    <div v-else-if="error">
      <article class="error">{{ error.statusMessage }}</article>
    </div>
    <div v-else-if="data">
      <article v-for="strategy in data" :key="strategy.id">{{ strategy.name }}</article>
      <h4>Loaded</h4>
    </div> -->
  </div>
</template>