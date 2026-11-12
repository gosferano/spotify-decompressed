import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import prettier from 'eslint-config-prettier/flat'

export default createConfigForNuxt()
  .append({
    rules: {
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'error',
    },
  })
  // Formatting is left to Prettier (`npm run lint:prettier`)
  .append(prettier)
