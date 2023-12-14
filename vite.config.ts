import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import vuetify from 'vite-plugin-vuetify'
import checker from 'vite-plugin-checker'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [
        vue(),
        vuetify({
            autoImport: false
        }),
        eslint({
            fix: true
        }),
        checker({
            vueTsc: true,
            typescript: true
        })
    ],
    base: './',
    define: {
        'process.env': {}
    },
    resolve: {
        alias: [
            {
                find: '@',
                replacement: fileURLToPath(new URL('./src', import.meta.url))
            },
            {
                find: '@vue/runtime-core',
                replacement: '@vue/runtime-core/dist/runtime-core.esm-bundler.js'
            }
        ],
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue'
        ]
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        https: false
    }
})
