import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import path from 'path';

// Плагин для удаления версий из импортов (@radix-ui/react-slot@1.1.2 → @radix-ui/react-slot)
function removeVersionsPlugin() {
  return {
    name: 'remove-versions',
    enforce: 'pre' as const,
    resolveId(source: string) {
      // Удаляем @version из импортов
      const match = source.match(/^(.+)@[\d.]+$/);
      if (match) {
        return { id: match[1], external: false };
      }
      return null;
    }
  };
}

// Плагин для резолвинга figma:asset/... в URL из Supabase Storage
function figmaAssetPlugin() {
  const SUPABASE_URL = 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent';
  
  return {
    name: 'figma-asset-resolver',
    enforce: 'pre' as const,
    resolveId(source: string, importer) {
      // Проверяем, начинается ли импорт с figma:asset/
      if (source.startsWith('figma:asset/')) {
        // Извлекаем имя файла из пути
        const fileName = source.replace('figma:asset/', '');
        // Создаем виртуальный модуль с URL
        const virtualId = `\0virtual:figma-asset/${fileName}`;
        return virtualId;
      }
      return null;
    },
    load(id: string) {
      // Если это наш виртуальный модуль figma-asset
      if (id.startsWith('\0virtual:figma-asset/')) {
        const fileName = id.replace('\0virtual:figma-asset/', '');
        // Возвращаем модуль, который экспортирует URL строку
        const imageUrl = `${SUPABASE_URL}/${fileName}`;
        return `export default ${JSON.stringify(imageUrl)};`;
      }
      return null;
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools({
    defaultDirectives: (url) => {
      // Автоматически конвертируем PNG, JPG, JPEG в WebP для оптимизации
      if (url.searchParams.has('raw')) {
        return new URLSearchParams();
      }
      
      // Для изображений из папки images/ применяем оптимизацию
      if (url.pathname.includes('/images/')) {
        return new URLSearchParams({
          format: 'webp',
          quality: '85',
          lossless: 'false',
        });
      }
      
      return new URLSearchParams();
    },
    // Оптимизация для быстрой загрузки
    extendOutputFormats: (builtins) => {
      return {
        ...builtins,
      };
    },
  }), removeVersionsPlugin(), figmaAssetPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  // Оптимизация сборки
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Сохраняем WebP файлы с правильным расширением
          if (assetInfo.name?.endsWith('.webp')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
