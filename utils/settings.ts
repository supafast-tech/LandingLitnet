export interface LandingSettings {
  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;

  // How it works section
  howItWorksTitle: string;
  howItWorksSteps: {
    number: string;
    title: string;
    description: string;
  }[];

  // Calendar section
  calendarTitle: string;
  calendarSubtitle: string;
  returnButtonText: string;
  returnButtonLink: string;

  // Footer
  footerCopyright: string;
  footerLinks: {
    text: string;
    link: string;
  }[];
  socialLinks: {
    vk: string;
    telegram: string;
    ok: string;
    dzen: string;
  };
  socialIcons: {
    vk: string;
    telegram: string;
    ok: string;
    dzen: string;
  };

  // Effects
  snowEnabled: boolean;
  snowIntensity: 'normal' | 'crazy';
}

const defaultSettings: LandingSettings = {
  heroTitle: 'Адвент\nкалендарь 2025',
  heroSubtitle: 'Каждый день декабря — новый подарок от Литнета',
  heroButtonText: 'Открыть календарь',
  heroButtonLink: '#calendar-section',

  howItWorksTitle: 'Как это\nработает?',
  howItWorksSteps: [
    {
      number: '01',
      title: 'Заходите каждый день',
      description: 'С 1 по 31 декабря открывается новое окошко календаря'
    },
    {
      number: '02',
      title: 'Открывайте подарок',
      description: 'Нажмите на активную дату и получите промокод или бонус'
    },
    {
      number: '03',
      title: 'Используйте на Литнете',
      description: 'Применяйте подарки для покупки любимых книг'
    },
    {
      number: '04',
      title: 'Собирайте все подарки',
      description: 'Дед Мороз приготовил для вас 31 праздничный сюрприз'
    }
  ],

  calendarTitle: 'Календарь\nподарков декабря 2025',
  calendarSubtitle: 'Открывайте новое окошко каждый день',
  returnButtonText: 'Вернуться на главную Литнета',
  returnButtonLink: 'https://litnet.com',

  footerCopyright: '© 2026 Litnet. Все права защищены.',
  footerLinks: [
    { text: 'Правила акции', link: '#' },
    { text: 'Политика конфиденциальности', link: '#' },
    { text: 'Пользовательское соглашение', link: '#' }
  ],
  socialLinks: {
    vk: 'https://vk.com/club90962773',
    telegram: 'https://t.me/litnetknigi',
    ok: 'https://ok.ru/litnetbook',
    dzen: 'https://dzen.ru/litnet_official'
  },
  socialIcons: {
    vk: '',
    telegram: '',
    ok: '',
    dzen: ''
  },

  snowEnabled: true,
  snowIntensity: 'normal'
};

// Initialize settings (for backward compatibility, now uses global settings)
export function initializeSettings(): void {
  // No longer needed - settings are loaded from server
  return;
}

// Get settings from cache (for immediate rendering)
// Actual settings should be loaded via fetchGlobalSettings from api.ts
export function getSettings(): LandingSettings {
  if (typeof window === 'undefined') return defaultSettings;

  const cached = sessionStorage.getItem('cached_global_settings');
  return cached ? JSON.parse(cached) : defaultSettings;
}

// Save settings to cache (temporary, until server updates)
export function saveSettings(settings: LandingSettings): void {
  if (typeof window === 'undefined') return;

  sessionStorage.setItem('cached_global_settings', JSON.stringify(settings));
}

// Cache global settings for fast access
export function cacheGlobalSettings(settings: LandingSettings): void {
  if (typeof window === 'undefined') return;

  sessionStorage.setItem('cached_global_settings', JSON.stringify(settings));
}

// Get default settings
export function getDefaultSettings(): LandingSettings {
  return defaultSettings;
}
