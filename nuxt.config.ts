// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    // head
    baseURL: '/spotify-decompressed/',
    head: {
      title: 'Spotify Decompressed',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Spotify extended history viewer',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }],
    },
  },

  modules: ['@nuxtjs/color-mode', '@pinia/nuxt'],
  ssr: false,

  css: ['@mdi/font/css/materialdesignicons.min.css', 'assets/scss/index.scss'],

  typescript: {
    strict: true,
    shim: false,
  },

  colorMode: {
    // Bulma's dark mode keys off .theme-dark / .theme-light
    classPrefix: 'theme-',
    classSuffix: '',
  },

  vite: {
    css: {
      preprocessorOptions: {
        // Bulma and the Oruga theme still use Sass syntax that newer Sass
        // deprecates; don't flood the build log with warnings about them
        scss: { quietDeps: true },
      },
    },
    // Pre-bundle these up front, so the dev server doesn't discover them
    // on first load and reload the page
    optimizeDeps: {
      include: [
        '@oruga-ui/oruga-next',
        '@oruga-ui/theme-bulma',
        'jszip',
        'localforage',
      ],
    },
  },

  compatibilityDate: '2025-06-02',
})
