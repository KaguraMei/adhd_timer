import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 改为相对路径
  build: {
    assetsDir: 'assets'
  },
  plugins: [
    vue(),
    viteSingleFile()  // 所有资源内联到一个 HTMLF
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
