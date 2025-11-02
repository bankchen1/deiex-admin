import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        'tests/**',
        '**/*.d.ts',
        '**/types/**',
        '**/types.ts',
        '**/index.ts',
        '**/main.ts',
        '**/App.vue',
        '**/router/**',
        '**/stores/**',
        '**/utils/cache.ts',
        '**/utils/download.ts',
        '**/utils/validate.ts',
        '**/utils/format.ts',
        '**/utils/i18n.ts',
        '**/services/**',
        '**/composables/useLocale.ts',
        '**/composables/useNotification.ts',
        '**/composables/useSessionTimeout.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
