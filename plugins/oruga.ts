import {
  Button,
  createOruga,
  Datepicker,
  Field,
  Icon,
  Modal,
  Pagination,
  Select,
  Table,
  Tabs,
  Upload,
} from '@oruga-ui/oruga-next'
import { bulmaConfig } from '@oruga-ui/theme-bulma'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(({ vueApp }) => {
  // Oruga only registers the components it is given
  vueApp.use(
    createOruga(bulmaConfig, [
      Button,
      Datepicker,
      Field,
      Icon,
      Modal,
      Pagination,
      Select,
      Table,
      Tabs,
      Upload,
    ]),
  )
})
