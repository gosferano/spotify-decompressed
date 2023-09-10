import Oruga from '@oruga-ui/oruga-next'
import { bulmaConfig } from '@oruga-ui/theme-bulma'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(Oruga, bulmaConfig) // .mount('#app');
})
