// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  eslint: {
    config: {
      stylistic: {
        semi: true,
        indent: "tab",
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
    }
  },
  ssr: true, // Ensure SSR is enabled for proper runtime config
  // Explicitly enable file-based routing
  pages: true,
  //   alias: { // does not work
  //   '~shared': './shared',
  //   '@shared': './shared'
  // },
});