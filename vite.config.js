import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import mdPlugin from 'vite-plugin-markdown'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),mdPlugin.plugin({
    mode: ['vue'],
  })],
  // base:"./backend/",
  resolve:{
    extensions:['.vue','.js'],
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  }
})
