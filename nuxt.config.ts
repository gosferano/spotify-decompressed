// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    // head
    baseURL: '/spotify-decompressed',
    head: {
      title: 'Spotify Decompressed',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Spotify extended history viewer',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  plugins: ['~/plugins/utils.ts'],
  ssr: false,
  css: [
    '@oruga-ui/oruga-next/src/scss/oruga-full-vars.scss',
    '@mdi/font/css/materialdesignicons.min.css',
    'assets/scss/index.scss',
  ],
  typescript: {
    strict: true,
    shim: false,
  },
})
