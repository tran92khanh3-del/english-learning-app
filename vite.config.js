import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// gray-matter cần Buffer (Node global) khi chạy trên trình duyệt → shim tối thiểu.
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
});
