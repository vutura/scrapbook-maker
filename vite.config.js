import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.woff2', '**/*.ttf', '**/*.otf', '**/*.woff'],  // Add any font formats you're using
})