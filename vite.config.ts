import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2015',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vue-vendor'
            }
            if (id.includes('ant-design-vue')) {
              return 'ui-vendor'
            }
            if (id.includes('echarts')) {
              return 'chart-vendor'
            }
            if (id.includes('axios') || id.includes('dayjs')) {
              return 'utils-vendor'
            }
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    open: false,
  },
})
