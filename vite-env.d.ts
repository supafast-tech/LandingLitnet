/// <reference types="vite/client" />

// Типы для vite-imagetools
declare module '*?format=webp' {
  const src: string;
  export default src;
}

declare module '*?format=webp&quality=*' {
  const src: string;
  export default src;
}

declare module '*?webp' {
  const src: string;
  export default src;
}
