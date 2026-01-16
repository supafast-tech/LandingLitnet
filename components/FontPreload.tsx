import { useEffect } from 'react';

export function FontPreload() {
  useEffect(() => {
    // Directly inject font CSS for immediate loading (для всех устройств)
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');
      
      @font-face {
        font-family: 'Argent CF';
        src: url('https://fonts.cdnfonts.com/s/15207/ArgentCF-Regular.woff') format('woff');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      
      @font-face {
        font-family: 'Argent CF';
        src: url('https://fonts.cdnfonts.com/s/15207/ArgentCF-Italic.woff') format('woff');
        font-weight: 400;
        font-style: italic;
        font-display: swap;
      }
      
      /* Force font usage and prevent FOUT */
      body {
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif !important;
      }
      
      /* Hide all text content until fonts are fully loaded */
      body:not(.fonts-loaded) * {
        visibility: hidden !important;
      }
      
      body.fonts-loaded * {
        visibility: visible !important;
      }
    `;
    document.head.insertBefore(style, document.head.firstChild);
    
    // Добавляем preconnect для Google Fonts
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    
    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    
    // Добавляем preconnect для CDN шрифтов
    const preconnect3 = document.createElement('link');
    preconnect3.rel = 'preconnect';
    preconnect3.href = 'https://fonts.cdnfonts.com';
    
    // Добавляем preload для основных шрифтов
    const preloadMontserrat = document.createElement('link');
    preloadMontserrat.rel = 'preload';
    preloadMontserrat.as = 'style';
    preloadMontserrat.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap';
    
    const preloadLora = document.createElement('link');
    preloadLora.rel = 'preload';
    preloadLora.as = 'style';
    preloadLora.href = 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap';
    
    const preloadArgentRegular = document.createElement('link');
    preloadArgentRegular.rel = 'preload';
    preloadArgentRegular.as = 'font';
    preloadArgentRegular.type = 'font/woff';
    preloadArgentRegular.href = 'https://fonts.cdnfonts.com/s/15207/ArgentCF-Regular.woff';
    preloadArgentRegular.crossOrigin = 'anonymous';
    
    const preloadArgentItalic = document.createElement('link');
    preloadArgentItalic.rel = 'preload';
    preloadArgentItalic.as = 'font';
    preloadArgentItalic.type = 'font/woff';
    preloadArgentItalic.href = 'https://fonts.cdnfonts.com/s/15207/ArgentCF-Italic.woff';
    preloadArgentItalic.crossOrigin = 'anonymous';
    
    // Добавляем в head если их там еще нет
    if (!document.querySelector('link[href="https://fonts.googleapis.com"]')) {
      document.head.insertBefore(preconnect1, document.head.firstChild);
    }
    if (!document.querySelector('link[href="https://fonts.gstatic.com"]')) {
      document.head.insertBefore(preconnect2, document.head.firstChild);
    }
    if (!document.querySelector('link[href="https://fonts.cdnfonts.com"]')) {
      document.head.insertBefore(preconnect3, document.head.firstChild);
    }
    
    // Добавляем preload
    document.head.appendChild(preloadMontserrat);
    document.head.appendChild(preloadLora);
    document.head.appendChild(preloadArgentRegular);
    document.head.appendChild(preloadArgentItalic);
    
    // Force browser to start loading fonts immediately
    document.fonts.ready.then(() => {
      console.log('All fonts loaded');
      document.body.classList.add('fonts-loaded');
    });
  }, []);
  
  return null;
}