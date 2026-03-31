import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
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
