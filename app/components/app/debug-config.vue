<template>
  <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
    <strong>Debug Info:</strong>
    <div>API Base: {{ config.public.apiBase }}</div>
    <div>Client Side: {{ mounted }}</div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})
</script>
