import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'sonner',
      'html2canvas',
      'jspdf',
      'dompurify',
      'react-markdown',
      'remark-gfm',
      'react-quill-new'
    ]
  }
})
