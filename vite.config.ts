import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DvmbrIntro',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      // 외부 의존성 없음
      external: [],
      output: {
        // 라이브러리 번들에 CSS 포함
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'index.css';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
