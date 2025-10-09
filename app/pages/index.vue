<script lang="ts" setup>
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Neo Admin Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Knowledge Bases Card -->
      <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Knowledge Bases</h2>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
        </div>
        <p class="text-gray-600 mb-4">Manage your knowledge bases and entries</p>
        <NuxtLink 
          to="/knowledge-bases"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View Knowledge Bases
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </NuxtLink>
      </div>

      <!-- Test Page Card -->
      <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Test</h2>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        <p class="text-gray-600 mb-4">Test your knowledge base queries</p>
        <NuxtLink 
          to="/test"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Go to Test
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </NuxtLink>
      </div>

      <!-- Analytics Card -->
      <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Analytics</h2>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
        <p class="text-gray-600 mb-4">View usage statistics and performance metrics</p>
        <button 
          disabled
          class="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
        >
          Coming Soon
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg border">
        <div class="text-2xl font-bold text-blue-600">-</div>
        <div class="text-sm text-gray-600">Knowledge Bases</div>
      </div>
      <div class="bg-white p-4 rounded-lg border">
        <div class="text-2xl font-bold text-green-600">-</div>
        <div class="text-sm text-gray-600">Total Entries</div>
      </div>
      <div class="bg-white p-4 rounded-lg border">
        <div class="text-2xl font-bold text-purple-600">-</div>
        <div class="text-sm text-gray-600">Chunk Strategies</div>
      </div>
      <div class="bg-white p-4 rounded-lg border">
        <div class="text-2xl font-bold text-orange-600">-</div>
        <div class="text-sm text-gray-600">API Calls</div>
      </div>
    </div>
  </div>
</template>