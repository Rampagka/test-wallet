import { vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from 'eslint-config-prettier/flat'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginVue from 'eslint-plugin-vue'

export default [
    ...pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,
    ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
    skipFormatting,
]
