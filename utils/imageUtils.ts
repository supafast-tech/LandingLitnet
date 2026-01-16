/**
 * Утилита для оптимизированного импорта изображений
 * Автоматически конвертирует в WebP и оптимизирует размер
 */

/**
 * Импортирует изображение с автоматической конвертацией в WebP
 * @param imagePath - путь к изображению
 * @param options - опции оптимизации
 * @returns URL оптимизированного изображения
 */
export function importOptimizedImage(
  imagePath: string,
  options?: {
    format?: 'webp' | 'avif' | 'png' | 'jpg';
    quality?: number;
    width?: number;
    height?: number;
  }
): string {
  // Если путь уже содержит параметры, просто возвращаем его
  if (imagePath.includes('?')) {
    return imagePath;
  }

  const { format = 'webp', quality = 85, width, height } = options || {};
  
  let optimizedPath = imagePath;
  
  // Добавляем параметры для vite-imagetools
  const params = new URLSearchParams();
  params.set('format', format);
  params.set('quality', quality.toString());
  
  if (width) {
    params.set('w', width.toString());
  }
  if (height) {
    params.set('h', height.toString());
  }

  optimizedPath = `${imagePath}?${params.toString()}`;
  
  // В runtime просто возвращаем путь, vite-imagetools обработает его при сборке
  // В dev режиме возвращаем оригинальный путь
  if (import.meta.env.DEV) {
    return imagePath;
  }
  
  return optimizedPath;
}

/**
 * Преобразует изображение в WebP формат
 */
export function toWebP(imagePath: string, quality: number = 85): string {
  return importOptimizedImage(imagePath, { format: 'webp', quality });
}
