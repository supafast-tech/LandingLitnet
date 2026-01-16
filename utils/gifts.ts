import { Gift, DayStatus } from '../types/gift';

// Default gifts data
export const defaultGifts: Gift[] = [
  {
    id: 1,
    date: '2025-12-01',
    title: 'Скидка 5% на все!',
    description: 'До Нового года еще целый месяц, а подарки уже подъехали. Дарим скидку 5% на все книги – можно спокойно запасаться чтением на длинные зимние вечера. Предложение действует до 2 декабря включительно.',
    promoCode: 'SKIDKA5',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 2,
    date: '2025-12-02',
    title: 'Скидка 10% на книги в жанре Любовные романы',
    description: 'Зима создана для сильных чувств и счастливых финалов. Скидка 10% на любовные романы поможет создать романтическое настроение и вернуть веру в любовь. Предложение действует до 3 декабря включительно.',
    promoCode: 'LOVE10',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 3,
    date: '2025-12-03',
    title: 'К СЛОВУ: Промокод Х% на подборку славянского фэнтези!',
    description: 'Тем, кто любит лесных духов, древние боги и волчьи тропы, пригодится небольшой магический бонус. Применяйте промокод на скидку Х% к подборке славянского фэнтези и забирайте книги про ведьм, леших и черта под боком. Предложение действует до 4 декабря включительно.',
    promoCode: 'SLAVFANХ',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 4,
    date: '2025-12-04',
    title: 'Промокод 10% на 3 книги из подборки конкурсных тайтлов',
    description: 'До праздников еще много забот, делаем выбор книжных подарков проще. Промокод 10% сработает на три книги из подборки конкурсных тайтлов – можно поддержать любимых авторов и открыть для себя новые имена. Предложение действует до 5 декабря включительно.',
    promoCode: 'TITLE10',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 5,
    date: '2025-12-05',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 6,
    date: '2025-12-06',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 7,
    date: '2025-12-07',
    title: 'ЛИТГОРОД: Промокод 7% на любую книгу',
    description: 'В этот декабрьский день вашим сюрпризом станет новая история на «Литгороде». Промокод 7% действует на любую книгу на платформе – выбирайте волшебство. Предложение действует до 8 декабря включительно.',
    promoCode: 'LITGOROD7',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 8,
    date: '2025-12-08',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 9,
    date: '2025-12-09',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 10,
    date: '2025-12-10',
    title: 'Промокод 15% на 2 книги в жанре Бытового фэнтези',
    description: 'Свет окон пятиэтажки, чайник на плите, а во всем этом – магия. Промокод 15% на две книги в жанре бытового фэнтези поможет собрать уютную зимнюю полку и поверить в чудеса. Предложение действует до 11 декабря включительно.',
    promoCode: 'BYTFANT15',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 11,
    date: '2025-12-11',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 12,
    date: '2025-12-12',
    title: 'Эксклюзивные обои с артами Литнета',
    description: 'Праздник к нам приходит! Загружайте эксклюзивные обои с артами от «Литнета», чтобы при взгляде на смартфон ловить книжный вайб. Предложение действует до 13 декабря включительно.',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 13,
    date: '2025-12-13',
    title: 'Промокод 50% на одну из книг-победителей конкурса (выбор из трех книг)',
    description: 'Новый год уже совсем близко, а у нас ооочень приятный подарок: промокод на огромную скидку в 50% на книгу-победителя конкурса на лучший роман в жанре бояръ-аниме «Наследники империи». Выберите одну из трех историй и примените промокод при покупке. Предложение действует до 14 декабря включительно.',
    promoCode: 'KONKURS50',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 14,
    date: '2025-12-14',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 15,
    date: '2025-12-15',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 16,
    date: '2025-12-16',
    title: 'Промокод 15% на 2 книги в жанре Романтической комедии',
    description: 'До Нового года всего две ��едели! Пора почитать романтические комедии, полные забавных недоразумений, неловких поцелуев и чудес. Держите промокод 15% на две книги: удовольствие гарантировано. Предложение действует до 17 декабря включительно.',
    promoCode: 'ROMCOM2Х15',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 17,
    date: '2025-12-17',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 18,
    date: '2025-12-18',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 19,
    date: '2025-12-19',
    title: 'К СЛОВУ: промокод на скидку 15% на печатную книгу "Дуэльный сезон" + промокод Литнета на 15% скидки на эл. "Дуэльный сезон"',
    description: 'Для тех, кто любит пошуршать страничками и потом дочитать историю с экрана, мы приготовили двойной подарок. Промокод на скидку на печатную книгу «Дуэльный сезон» и дополнительная скидка 15% на электронную версию: соберите полный комплект. Предложение действует до 20 декабря включительно. Промокод на электронную книгу - DUEL10. Промокод на бумажную книгу - МАРИНБУРГ.',
    promoCode: 'DUEL10',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 20,
    date: '2025-12-20',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 21,
    date: '2025-12-21',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 22,
    date: '2025-12-22',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 23,
    date: '2025-12-23',
    title: 'Промокод 10% на 5 книг из подборки некомов',
    description: 'Под конец года особенно хочется поддержать тех, кто пишет из любви к искусству. Промокод 10% действует на пять ��ниг из подборки некоммерческих авторов. Чудо – это вы. Предложение действует до 24 декабря включительно.',
    promoCode: 'NECOMM10',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 24,
    date: '2025-12-24',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 25,
    date: '2025-12-25',
    title: 'К СЛОВУ: Промокод Х% на книги из подборки новогодних историй',
    description: 'Снег за окном, дома пахнет мандаринами и ёлкой. Вам промокод на скидку: Х% на книги из подборки новогодних историй – выбирайте сюжет для долгого зимнего вечера. Предложение действует до 26 декабря включительно.',
    promoCode: 'NOVOGODХХ',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 26,
    date: '2025-12-26',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 27,
    date: '2025-12-27',
    title: 'Промокод 20% на 2 книги из подборки Новогодних историй',
    description: 'Новый год все ближе, самое время устроить себе читательский марафон. Промокод 20% на две книги из подборки новогодних историй поможет провести несколько вечеров подряд у елки в компании с чудесами. Предложение действует до 28 декабря включительно.',
    promoCode: 'NOVOGOD2Х20',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 28,
    date: '2025-12-28',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 29,
    date: '2025-12-29',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 30,
    date: '2025-12-30',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 31,
    date: '2025-12-31',
    title: '',
    description: '',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: true,
  },
  {
    id: 32,
    date: '2026-01-01',
    title: 'С Новым Годом!',
    description: 'Акция завершена. Спасибо за участие!',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: false,
  },
  {
    id: 33,
    date: '2026-01-02',
    title: 'Акция завершена',
    description: 'Акция завершена. Спасибо за участие!',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: false,
  },
  {
    id: 34,
    date: '2026-01-03',
    title: 'Акция завершена',
    description: 'Акция завершена. Спасибо за участие!',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: false,
  },
  {
    id: 35,
    date: '2026-01-04',
    title: 'Акция завершена',
    description: 'Акция завершена. Спасибо за участие!',
    promoCode: '',
    buttonLink: 'https://litnet.com',
    enabled: false,
  },
];

// Initialize gifts in localStorage if not exists
export function initializeGifts(): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem('advent_gifts');
  if (!stored) {
    localStorage.setItem('advent_gifts', JSON.stringify(defaultGifts));
  }
}

// Get all gifts from localStorage
export function getGifts(): Gift[] {
  if (typeof window === 'undefined') return defaultGifts;
  
  const stored = localStorage.getItem('advent_gifts');
  return stored ? JSON.parse(stored) : defaultGifts;
}

// Save gifts to localStorage
export function saveGifts(gifts: Gift[]): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('advent_gifts', JSON.stringify(gifts));
}

// Update a single gift
export function updateGift(gift: Gift): void {
  const gifts = getGifts();
  const index = gifts.findIndex(g => g.id === gift.id);
  if (index !== -1) {
    gifts[index] = gift;
    saveGifts(gifts);
  }
}

// Get gift by date
export function getGiftByDate(date: string): Gift | undefined {
  const gifts = getGifts();
  return gifts.find(g => g.date === date);
}

// Get day status
export function getDayStatus(giftDate: string): DayStatus {
  if (typeof window === 'undefined') {
    const today = new Date('2025-12-10');
    today.setHours(0, 0, 0, 0);
    
    const gift = new Date(giftDate);
    gift.setHours(0, 0, 0, 0);
    
    if (gift < today) return 'past';
    if (gift > today) return 'future';
    return 'current';
  }
  
  // Check if using real date or test date
  const useRealDateSetting = localStorage.getItem('admin_use_real_date');
  const testDate = localStorage.getItem('admin_test_date');
  
  // По умолчанию используем реальную дату (если явно не отключено)
  const useRealDate = useRealDateSetting === null ? true : useRealDateSetting === 'true';
  
  let today: Date;
  
  if (useRealDate) {
    // Use actual current date
    today = new Date();
  } else {
    // Use test date (default to December 10, 2025)
    const day = testDate ? parseInt(testDate) : 10;
    today = new Date(`2025-12-${day.toString().padStart(2, '0')}`);
  }
  
  today.setHours(0, 0, 0, 0);
  
  const gift = new Date(giftDate);
  gift.setHours(0, 0, 0, 0);
  
  // Debug log for day 19
  if (giftDate === '2025-12-19') {
    console.log('[getDayStatus] Checking day 19:');
    console.log('  - Gift date:', giftDate);
    console.log('  - Gift date object:', gift);
    console.log('  - Today:', today);
    console.log('  - Use real date:', useRealDate);
    console.log('  - Test date:', testDate);
    console.log('  - gift < today:', gift < today);
    console.log('  - gift > today:', gift > today);
    console.log('  - Status:', gift < today ? 'past' : (gift > today ? 'future' : 'current'));
  }
  
  if (gift < today) return 'past';
  if (gift > today) return 'future';
  return 'current';
}

// Format date for display
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.getDate().toString();
}