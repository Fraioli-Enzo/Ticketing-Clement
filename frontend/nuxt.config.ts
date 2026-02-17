// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon'],
  
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI
    //mongodbUri: 'mongodb://82.112.240.32:27017'
  }
})