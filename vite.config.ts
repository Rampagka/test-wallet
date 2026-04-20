import basicSsl from '@vitejs/plugin-basic-ssl'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { URL, fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import vuetify from 'vite-plugin-vuetify'

// Wraps Vuetify component CSS in @layer vuetify so that Tailwind utilities
// (which are in @layer utilities) always take precedence in production builds.
const vuetifyCssLayer: Plugin = {
    name: 'vuetify-css-layer',
    transform(code, id) {
        if (/node_modules\/vuetify/.test(id) && id.includes('.css')) {
            return { code: `@layer vuetify {\n${code}\n}`, map: null }
        }
    },
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        basicSsl(),
        vuetifyCssLayer,
        vue(),
        vuetify({ autoImport: true }),
        tailwindcss(),
        nodePolyfills({
            globals: { Buffer: true },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
