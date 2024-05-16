import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import { ViteMpPlugin } from 'vite-plugin-mp';
import { ejsConfig } from './ejs.config'


const Cookie  = '210830fg0950_session=eyJpdiI6InFaRm1rS2I0aFF2OHZQZEk4cmJuVWc9PSIsInZhbHVlIjoid09yUnI5ZGNuMXlHSVJRZ0NqT040bjlNcUlwNEtTSHkzMWxoeUQ5M0UyWWg1S1VJVTBFOW05dE9BWmV6TUJLcy9JZ2lNbEhJT0grejIvZnl6VmlLQVZvditZNmp3d1oreVMzd3FDTHJPd1lHaStTbElQSXFjZHIzMmtZU2RiTW4iLCJtYWMiOiJlYjkxZGU2NmU4MWFlN2U3YWQ1MTg2OWEyMDIwZGIyN2UwNGMwMGE1ZjIzMzhjYjNkODMyMzEzYzQxNTY0Y2FjIiwidGFnIjoiIn0%3D; expires=Tue, 07-May-2024 07:10:17 GMT; Max-Age=1800; path=/; httponly; samesite=lax';
export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? '/as-admin/dist/' : '/',
    plugins: [
        AutoImport({
            dts: true,
            imports: ['vue'],
        }),
        Components({
            dts: true,
            dirs: ['common/components'],
        }),
        Vue(),
        ViteMpPlugin(),
        ViteEjsPlugin(ejsConfig),
        ViteMinifyPlugin(),
    ],
    server: {
        proxy: {
            '/admin': {
                target: 'https://bdb.intonecc.com',
                // target: 'http://doublec-local.intonecc.com',
                changeOrigin: true,
                headers: {
                    Cookie: Cookie
                },
            },
            '/azure': {
                target: 'https://bdb.intonecc.com',
                // target: 'http://doublec-local.intonecc.com',
                changeOrigin: true,
                headers: {
                    Cookie: Cookie
                },
            }
        },
    },
    build: {
        chunkSizeWarningLimit: 9999,
    },
})
