import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-b7aac3cb`;

export interface StatsParameter {
  id: number;
  param_key: string;
  param_label: string;
  test_value: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StatsData {
  // URL params storage
  url_params?: string;  // JSON string of URLParam[]
  
  // Slide data
  slide1_title?: string;
  slide1_subtitle?: string;
  
  slide2_books_count_param?: string;  // URL parameter name for books count
  slide2_text?: string;
  slide2_card_text?: string;
  
  slide3_subscriptions_count_param?: string;  // URL parameter name
  slide3_text?: string;
  slide3_card_text?: string;
  
  slide4_library_count_param?: string;
  slide4_text?: string;
  slide4_card_text?: string;
  
  slide5_pages_count_param?: string;
  slide5_text?: string;
  slide5_card_text?: string;
  
  slide6_genre_param?: string;
  slide6_text?: string;
  slide6_card_text?: string;
  
  slide7_books_in_genre_param?: string;
  slide7_text?: string;
  slide7_card_text?: string;
  
  slide8_author_param?: string;
  slide8_text?: string;
  slide8_card_text?: string;
  
  slide9_awards_count_param?: string;
  slide9_text?: string;
  slide9_card_text?: string;
  slide9_button_text?: string;
  slide9_button_url?: string;
  
  slide10_comments_count_param?: string;
  slide10_text?: string;
  slide10_card_text?: string;
  slide10_button_text?: string;
  slide10_button_url?: string;
  
  slide11_title?: string;
  slide11_subtitle?: string;
  slide11_button_text?: string;
  slide11_button_link?: string;
}

export async function fetchStatsContent(): Promise<StatsData> {
  try {
    const response = await fetch(`${API_BASE}/stats-content`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch stats content from server, using defaults');
      return getDefaultStatsData();
    }
    
    return response.json();
  } catch (error) {
    console.warn('Error fetching stats content, using defaults:', error);
    return getDefaultStatsData();
  }
}

// Default stats data
function getDefaultStatsData(): StatsData {
  return {
    url_params: '[]',
    slide1_title: 'Ваш книжный 2025\nв одном месте',
    slide1_subtitle: 'Всё, что вы читали, поддерживали и комментировали – теперь в красивом отчёте.\nОткройте, чтобы вспомнить лучшие моменты года.',
    slide2_books_count_param: 'books_count',
    slide2_text: 'Вы купили {число}\nв 2025 году!',
    slide2_card_text: 'Как вы думаете, если бы это были бумажные издания, то стопка была бы высотой с котика, пони или дракона?',
    slide3_subscriptions_param: 'subscriptions_count',
    slide3_text: 'Вы подписались на {число} в 2025 году.',
    slide3_card_text: 'Возможно, вы нашли новые любимые голоса или следите за творчеством знакомых авторов. В любом случае, это отличная компания!',
    slide4_library_param: 'library_count',
    slide4_text: 'В вашей библиотеке {число}.',
    slide4_card_text: 'Это целая вселенная историй, готовых к прочтению в любой момент. Что выберете следующим?',
    slide5_pages_param: 'pages_count',
    slide5_text: 'Вы прочитали {число} в 2025 году.',
    slide5_card_text: 'Если бы это была одна книга, она бы точно попала в список самых длинных романов!',
    slide6_genre_param: 'favorite_genre',
    slide6_text: 'Ваш жанр – {жанр}.',
    slide6_card_text: 'Из всех добавленных вами в библиотеку у 2025 году книг большинство относятся к жанру {жанр}. Вы созданы друг для друга!',
    slide7_books_in_genre_param: 'books_in_genre_count',
    slide7_text: '{число} в жанре {жанр} вы купили в 2025 году.',
    slide7_card_text: 'Кажется, у вас серьёзные отношения с {жанр}',
    slide8_author_param: 'favorite_author',
    slide8_text: 'Книги {имя автора} покорили ваше сердце в 2025 году.',
    slide8_card_text: 'Вы прочитали больше всего произведений этого автора. Настоящая литературная любовь!',
    slide9_awards_count_param: 'awards_count',
    slide9_text: 'Вы подарили {число} в 2025 году.',
    slide9_card_text: 'Ваша поддержка помогает авторам продолжать творить!',
    slide9_button_text: 'Подарить награду',
    slide9_button_url: 'https://litnet.com/account/library',
    slide10_comments_count_param: 'comments_count',
    slide10_text: 'Вы оставили {число} комментариев в 2025 году.',
    slide10_card_text: 'Ваше мнение важно для авторов и других читателей!',
    slide10_button_text: 'Читайте ещё с выгодой',
    slide10_button_url: 'https://litnet.com/account/library?discount_code=READ2026',
    slide11_title: 'В 2025 вы открывали много новых сюжетов, но в вашей библиотеке до сих пор лежат книги, которые ждут своего часа.',
    slide11_subtitle: 'Чтобы вам было проще не откладывать их на следующий год, мы дарим вам промокод READ2026 на скидку 20%: вы можете использовать его до пяти раз.',
    slide11_button_text: 'Вернуться на Litnet',
    slide11_button_link: 'https://litnet.com'
  };
}

export async function updateStatsContent(data: StatsData): Promise<void> {
  const response = await fetch(`${API_BASE}/stats-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update stats content');
  }
}

export async function fetchStatsParameters(): Promise<StatsParameter[]> {
  try {
    const response = await fetch(`${API_BASE}/stats-parameters`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch stats parameters from server, using defaults');
      return getDefaultStatsParameters();
    }
    
    return response.json();
  } catch (error) {
    console.warn('Error fetching stats parameters, using defaults:', error);
    return getDefaultStatsParameters();
  }
}

// Default stats parameters
function getDefaultStatsParameters(): StatsParameter[] {
  return [
    { id: 1, param_key: 'books_count', param_label: 'Количество книг', test_value: '127' },
    { id: 2, param_key: 'subscriptions_count', param_label: 'Количество подписок', test_value: '35' },
    { id: 3, param_key: 'library_count', param_label: 'Книг в библиотеке', test_value: '250' },
    { id: 4, param_key: 'pages_count', param_label: 'Количество страниц', test_value: '12500' },
    { id: 5, param_key: 'favorite_genre', param_label: 'Любимый жанр', test_value: 'Фэнтези' },
    { id: 6, param_key: 'books_in_genre_count', param_label: 'Книг в любимом жанре', test_value: '45' },
    { id: 7, param_key: 'favorite_author', param_label: 'Любимый автор', test_value: 'Александр Пушкин' },
    { id: 8, param_key: 'awards_count', param_label: 'Количество наград', test_value: '75' },
    { id: 9, param_key: 'comments_count', param_label: 'Количество комментариев', test_value: '82' }
  ];
}