/* eslint-disable no-restricted-imports */
import baseConfig from './src/core/configs/eslint/base'
import importsConfig from './src/core/configs/eslint/imports'
import moduleStructure from './src/core/configs/eslint/module-structure'
/* eslint-enable no-restricted-imports */

import { defineConfigWithVueTs } from '@vue/eslint-config-typescript'
import { globalIgnores } from 'eslint/config'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/generated/**']),

  ...baseConfig,
  importsConfig,
  moduleStructure,
)
