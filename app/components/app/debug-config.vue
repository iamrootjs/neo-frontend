<template>
  <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
    <strong>Debug Info:</strong>
    <div>API Base: {{ config.public.apiBase }}</div>
    <div>Environment: {{ process.client ? 'Client' : 'Server' }}</div>
    <div>NODE_ENV: {{ process.env.NODE_ENV }}</div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
</script>
