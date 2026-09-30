import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 统一从 src 根目录导入模块，避免页面层级变化后批量修改相对路径。
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
