import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Enable CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Enable logging
app.use('*', logger(console.log));

// Health check
app.get('/make-server-b7aac3cb/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== SETTINGS ROUTES =====

// Get global settings
app.get('/make-server-b7aac3cb/settings', async (c) => {
  try {
    console.log('Fetching global settings...');
    const settings = await kv.get('global_landing_settings');
    
    if (!settings) {
      console.log('No settings found, returning defaults');
      // Return default settings if not found
      const defaultSettings = {
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
        footerCopyright: '© 2025 Litnet. Все права защищены.',
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
      
      return c.json(defaultSettings);
    }
    
    console.log('Returning stored settings');
    return c.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return c.json({ error: 'Failed to fetch settings', details: String(error) }, 500);
  }
});

// Update global settings
app.post('/make-server-b7aac3cb/settings', async (c) => {
  try {
    console.log('[SETTINGS] Received update settings request');
    // Read request body safely
    let settings;
    try {
      const body = await c.req.text();
      if (!body || body.trim() === '') {
        console.error('[SETTINGS] Request body is empty');
        return c.json({ error: 'Request body is empty' }, 400);
      }
      settings = JSON.parse(body);
      console.log('[SETTINGS] Parsed settings successfully');
    } catch (parseError) {
      console.error('[SETTINGS] Error parsing JSON:', parseError);
      return c.json({ error: 'Invalid JSON in request body' }, 400);
    }
    
    await kv.set('global_landing_settings', settings);
    console.log('[SETTINGS] Settings saved successfully');
    
    return c.json({ success: true, settings });
  } catch (error) {
    console.error('[SETTINGS] Error updating settings:', error);
    return c.json({ error: 'Failed to update settings', details: String(error) }, 500);
  }
});

// ===== CONTENT ROUTES =====

// Get all content from advent_content table
app.get('/make-server-b7aac3cb/content', async (c) => {
  try {
    console.log('[CONTENT] Fetching all content from advent_content table...');
    const { data, error } = await supabase
      .from('advent_content')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('[CONTENT] Error fetching from advent_content:', error);
      throw error;
    }
    
    console.log(`[CONTENT] Successfully fetched ${data?.length || 0} content items`);
    
    // Transform to key-value object for easier access
    const keysToExclude = ['footer_link_terms_visible', 'footer_link_privacy_visible', 'footer_link_help_visible'];
    const contentObj: Record<string, string | boolean> = {};
    (data || []).forEach(item => {
      // Skip removed visibility flags
      if (keysToExclude.includes(item.key)) {
        return;
      }
      // Parse boolean values for visibility fields
      if (item.key.endsWith('_visible')) {
        contentObj[item.key] = item.value === 'true';
      } else {
        contentObj[item.key] = item.value;
      }
    });
    
    return c.json(contentObj);
  } catch (error) {
    console.error('[CONTENT] Error fetching content:', error);
    return c.json({ error: 'Failed to fetch content', details: String(error) }, 500);
  }
});

// Update content item in advent_content table
app.post('/make-server-b7aac3cb/content/:key', async (c) => {
  const key = c.req.param('key');
  
  try {
    console.log(`[CONTENT-UPDATE] Received update request for key: ${key}`);
    
    // Read request body safely
    let updateData;
    try {
      const body = await c.req.text();
      if (!body || body.trim() === '') {
        console.error(`[CONTENT-UPDATE] Request body is empty for key ${key}`);
        return c.json({ error: 'Request body is empty' }, 400);
      }
      updateData = JSON.parse(body);
      console.log(`[CONTENT-UPDATE] Parsed data successfully for key ${key}:`, updateData);
    } catch (parseError) {
      console.error(`[CONTENT-UPDATE] Error parsing JSON for key ${key}:`, parseError);
      return c.json({ error: 'Invalid JSON in request body' }, 400);
    }
    
    const { value } = updateData;
    
    if (value === undefined) {
      console.error(`[CONTENT-UPDATE] Missing value for key ${key}`);
      return c.json({ error: 'Value is required' }, 400);
    }
    
    // Convert boolean to string for storage
    const valueToStore = typeof value === 'boolean' ? String(value) : value;
    
    // Determine category based on key
    const category = key.includes('admin') || key.includes('settings') ? 'settings' : 
                     key.includes('footer') ? 'footer' : 
                     key.includes('social') ? 'social' : 'general';
    
    console.log(`[CONTENT-UPDATE] Updating advent_content table for key ${key} with value:`, valueToStore, 'category:', category);
    
    const { data, error } = await supabase
      .from('advent_content')
      .upsert({ 
        key,
        value: valueToStore,
        category,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })
      .select()
      .single();
    
    if (error) {
      console.error(`[CONTENT-UPDATE] Error updating key ${key}:`, error);
      console.error(`[CONTENT-UPDATE] Error details:`, JSON.stringify(error, null, 2));
      return c.json({ 
        error: 'Failed to update content', 
        details: error.message || error.hint || JSON.stringify(error)
      }, 500);
    }
    
    console.log(`[CONTENT-UPDATE] Key ${key} updated successfully in database`);
    
    return c.json({ success: true, data });
  } catch (error) {
    console.error(`[CONTENT-UPDATE] Error updating content key ${key}:`, error);
    return c.json({ 
      error: 'Failed to update content', 
      details: error instanceof Error ? error.message : String(error) 
    }, 500);
  }
});

// ===== CALENDAR DAY ROUTES =====

// Initialize all calendar days (if not exist) - MUST BE BEFORE :day routes!
app.post('/make-server-b7aac3cb/calendar-days/init', async (c) => {
  try {
    console.log('[INIT] Checking advent_calendar table...');
    const { data, error, count } = await supabase
      .from('advent_calendar')
      .select('day', { count: 'exact' })
      .limit(5);
    
    if (error) {
      console.error('[INIT] Error checking advent_calendar:', error);
      const errorMsg = error.message || error.toString() || 'Unknown database error';
      return c.json({ error: 'Database error', details: errorMsg }, 500);
    }
    
    console.log(`[INIT] Found ${data?.length || 0} rows in advent_calendar table (total count: ${count})`);
    
    if (data && data.length > 0) {
      console.log('[INIT] advent_calendar table has data - initialization successful');
      return c.json({ 
        success: true, 
        message: 'Calendar table already initialized', 
        count: count || data.length,
        sample: data.map(d => d.day)
      });
    }
    
    console.log('[INIT] advent_calendar table appears empty - should be pre-populated via SQL');
    return c.json({ 
      success: true, 
      message: 'Table should be pre-populated via SQL',
      warning: 'No data found in advent_calendar table'
    });
  } catch (error) {
    console.error('[INIT] Error initializing calendar days:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return c.json({ 
      error: 'Failed to check calendar table', 
      details: errorMsg 
    }, 500);
  }
});

// Get all calendar days from advent_calendar table
app.get('/make-server-b7aac3cb/calendar-days', async (c) => {
  try {
    console.log('[CALENDAR] Fetching all calendar days from advent_calendar table...');
    const { data, error } = await supabase
      .from('advent_calendar')
      .select('*')
      .order('day', { ascending: true });
    
    if (error) {
      console.error('[CALENDAR] Error fetching from advent_calendar:', error);
      throw error;
    }
    
    console.log(`[CALENDAR] Successfully fetched ${data?.length || 0} days`);
    
    // Transform DB data to match frontend format
    const transformedDays = (data || []).map(row => ({
      day: row.day,
      title: row.title || '',
      subtitle: '', // Not used in new structure
      giftType: row.gift_type || 'promo',
      promoCode: row.gift_value || '',
      promoDescription: row.description || '',
      promoDisclaimer: row.valid_until_text || '',
      discount: '',
      bonusAmount: '',
      bonusDescription: '',
      hoverLabel: `${row.day} декабря`, // Генерируем на основе номера дня
      lockedMessage: row.fallback_before_text || 'Этот день ещё не наступил',
      pastMessage: row.fallback_after_text || 'Этот подарок уже недоступен',
      buttonLink: row.button_link || '#',
      buttonText: row.button_text || 'Перейти к подарку',
      downloadFile: row.download_file || false,
      // Второй промокод
      promoCode2: row.gift_value_2 || '',
      promoDisclaimer2: row.valid_until_text_2 || '',
      buttonLink2: row.button_link_2 || '',
      buttonText2: row.button_text_2 || '',
      downloadFile2: row.download_file_2 || false,
      popupType: row.popup_type || 'single_promo' // Добавляем тип попапа
    }));
    
    return c.json(transformedDays);
  } catch (error) {
    console.error('[CALENDAR] Error fetching calendar days:', error);
    return c.json({ error: 'Failed to fetch calendar days', details: String(error) }, 500);
  }
});

// Get single calendar day from advent_calendar table
app.get('/make-server-b7aac3cb/calendar-days/:day', async (c) => {
  const dayParam = c.req.param('day');
  const day = parseInt(dayParam);
  
  try {
    console.log(`[CALENDAR] Fetching day ${day} from advent_calendar table (param: ${dayParam})...`);
    
    // Validate day parameter
    if (isNaN(day) || day < 1 || day > 31) {
      console.error(`[CALENDAR] Invalid day parameter: ${dayParam}`);
      return c.json({ error: 'Invalid day parameter', details: `Day must be a number between 1 and 31, got: ${dayParam}` }, 400);
    }
    
    const { data, error } = await supabase
      .from('advent_calendar')
      .select('*')
      .eq('day', day)
      .single();
    
    if (error) {
      console.error(`[CALENDAR] Error fetching day ${day}:`, error);
      return c.json({ error: 'Day not found' }, 404);
    }
    
    // Transform DB data to match frontend format
    const transformedDay = {
      day: data.day,
      title: data.title || '',
      subtitle: '',
      giftType: data.gift_type || 'promo',
      promoCode: data.gift_value || '',
      promoDescription: data.description || '',
      promoDisclaimer: data.valid_until_text || '',
      discount: '',
      bonusAmount: '',
      bonusDescription: '',
      hoverLabel: `${data.day} декабря`, // Генерируем на основе номера дня
      lockedMessage: data.fallback_before_text || 'Этот день ещё не наступил',
      pastMessage: data.fallback_after_text || 'Этот подарок уже недоступен',
      buttonLink: data.button_link || '#',
      buttonText: data.button_text || 'Перейти к подарку',
      downloadFile: data.download_file || false,
      // Второй промокод
      promoCode2: data.gift_value_2 || '',
      promoDisclaimer2: data.valid_until_text_2 || '',
      buttonLink2: data.button_link_2 || '',
      buttonText2: data.button_text_2 || '',
      downloadFile2: data.download_file_2 || false,
      popupType: data.popup_type || 'single_promo' // Добавляем тип попапа
    };
    
    return c.json(transformedDay);
  } catch (error) {
    console.error(`[CALENDAR] Error fetching calendar day ${dayParam}:`, error);
    return c.json({ error: 'Failed to fetch calendar day', details: String(error) }, 500);
  }
});

// Update calendar day in advent_calendar table
app.post('/make-server-b7aac3cb/calendar-days/:day', async (c) => {
  const dayParam = c.req.param('day');
  const day = parseInt(dayParam);
  
  try {
    console.log(`[DAY-UPDATE] Received update request for day ${day} (param: ${dayParam})`);
    
    // Validate day parameter
    if (isNaN(day) || day < 1 || day > 31) {
      console.error(`[DAY-UPDATE] Invalid day parameter: ${dayParam}`);
      return c.json({ error: 'Invalid day parameter', details: `Day must be a number between 1 and 31, got: ${dayParam}` }, 400);
    }
    
    // Read request body safely
    let dayData;
    try {
      const body = await c.req.text();
      if (!body || body.trim() === '') {
        console.error(`[DAY-UPDATE] Request body is empty for day ${day}`);
        return c.json({ error: 'Request body is empty' }, 400);
      }
      dayData = JSON.parse(body);
      console.log(`[DAY-UPDATE] Parsed day data successfully for day ${day}:`, dayData);
    } catch (parseError) {
      console.error(`[DAY-UPDATE] Error parsing JSON for day ${day}:`, parseError);
      return c.json({ error: 'Invalid JSON in request body' }, 400);
    }
    
    // Transform frontend format to DB format
    const dbData = {
      title: dayData.title || '',
      description: dayData.promoDescription || '',
      gift_type: dayData.giftType || 'promo',
      gift_value: dayData.promoCode || '',
      valid_until_text: dayData.promoDisclaimer || '',
      fallback_before_text: dayData.lockedMessage || 'Этот день ещё не наступил',
      fallback_after_text: dayData.pastMessage || 'Этот подарок уже недоступен',
      button_link: dayData.buttonLink || '#',
      button_text: dayData.buttonText || 'Перейти к подарку',
      download_file: dayData.downloadFile || false,
      // Второй промокод
      gift_value_2: dayData.promoCode2 || null,
      valid_until_text_2: dayData.promoDisclaimer2 || null,
      button_link_2: dayData.buttonLink2 || null,
      button_text_2: dayData.buttonText2 || null,
      download_file_2: dayData.downloadFile2 || false,
      popup_type: dayData.popupType || 'single_promo', // Добавляем тип попапа
      updated_at: new Date().toISOString()
    };
    
    console.log(`[DAY-UPDATE] Updating advent_calendar table for day ${day}:`, dbData);
    
    const { data, error } = await supabase
      .from('advent_calendar')
      .update(dbData)
      .eq('day', day)
      .select()
      .single();
    
    if (error) {
      console.error(`[DAY-UPDATE] Error updating day ${day}:`, error);
      throw error;
    }
    
    console.log(`[DAY-UPDATE] Day ${day} updated successfully in database`);
    
    return c.json({ success: true, data: dayData });
  } catch (error) {
    console.error(`[DAY-UPDATE] Error updating calendar day ${day}:`, error);
    return c.json({ error: 'Failed to update calendar day', details: String(error) }, 500);
  }
});

// ===== STATS CONTENT ROUTES =====

// Get stats parameters from stats_parameters table
app.get('/make-server-b7aac3cb/stats-parameters', async (c) => {
  try {
    console.log('[STATS] Fetching stats parameters...');
    const { data, error } = await supabase
      .from('stats_parameters')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('[STATS] Error fetching stats parameters:', error);
      throw error;
    }
    
    console.log(`[STATS] Successfully fetched ${data?.length || 0} parameters`);
    return c.json(data || []);
  } catch (error) {
    console.error('[STATS] Error fetching stats parameters:', error);
    return c.json({ error: 'Failed to fetch stats parameters', details: String(error) }, 500);
  }
});

// Get stats content
app.get('/make-server-b7aac3cb/stats-content', async (c) => {
  try {
    console.log('[STATS] Fetching stats content from stats_content table...');
    const { data, error } = await supabase
      .from('stats_content')
      .select('*');
    
    if (error) {
      console.error('[STATS] Error fetching stats content:', error);
      throw error;
    }
    
    console.log(`[STATS] Successfully fetched ${data?.length || 0} stats content items`);
    
    // Transform to key-value object
    const statsObj: Record<string, string> = {};
    (data || []).forEach(item => {
      statsObj[item.key] = item.value;
    });
    
    // If empty, return defaults
    if (Object.keys(statsObj).length === 0) {
      console.log('[STATS] No stats found, returning defaults');
      return c.json({
        url_params: '[]',
        slide1_title: 'Ваш книжный 2025\nв одном месте',
        slide1_subtitle: 'Всё, что вы читали, поддерживали и комментировали – теперь в красивом отчёте.\nОткройте, чтобы вспомнить лучшие моменты года.',
        slide2_books_count_param: 'books_count',
        slide2_text: 'Вы купили {число}\\nв 2025 году!',
        slide2_card_text: 'Как вы думаете, если бы это были бумажные издания, то стопка была бы высотой с котика, пони или дракона?',
        slide3_subscriptions_count_param: 'subscriptions_count',
        slide3_text: 'В 2025 году\\nвы купили\\n{число}.',
        slide3_card_text: 'Подписка помогает поддерживать авторов: вы покупаете их книги в процессе написания, ждете новые главы, делитесь эмоциями, вдохновляете и мотивируете.',
        slide4_library_count_param: 'library_count',
        slide4_text: 'В 2025 году\\nваша личная библиотека\\nпополнилась на {число}.',
        slide4_card_text: 'В вашей книжной галактике зажглись новые звезды.',
        slide5_pages_count_param: 'pages_count',
        slide5_text: 'За 2025\\nвы прочитали\\n{число}.',
        slide5_card_text: '',
        slide6_genre_param: 'favorite_genre',
        slide6_text: 'Ваш жанр – {жанр}.',
        slide6_card_text: 'Из всех добавленных вами в библиотеку у 2025 году книг большинство относятся к жанру {жанр}.\\nВы созданы друг для друга!',
        slide7_books_in_genre_param: 'books_in_genre_count',
        slide7_text: '{число} книг в жанре {жанр} вы купили в 2025 году.',
        slide7_card_text: 'Кажется, у вас серьёзные отношения с {жанр}',
        slide8_author_param: 'favorite_author',
        slide8_text: 'В 2025 году вы отдали сердце {имя автора}: большинство купленных вами книг написал именно этот автор.',
        slide8_card_text: 'Вот что делает авторов по-настоящему счастливыми!',
        slide9_awards_count_param: 'awards_count',
        slide9_text: 'В 2025 году\\nвы подарили авторам\\n{число}.',
        slide9_card_text: 'Награда – теплая поддержка, признание и благодарность, которые дарят автору вдохновение.\\\\\\\\n\\\\\\\\nПодарите награду любимому автору прямо сейчас!',
        slide9_button_text: 'Подарить награду',
        slide9_button_url: 'https://litnet.com/account/library',
        slide10_comments_count_param: 'comments_count',
        slide10_text: 'В 2025 году вы оставили {число} комментариев.',
        slide10_card_text: 'Комментарии — ваш голос и прямая связь с автором: делясь реакциями и вопросами, ы поддерживаете писателя и даже можете влиять на развитие сюжета в подписках..',
        slide10_button_text: 'Читайте ещё с выгодой',
        slide10_button_url: 'https://litnet.com/account/library?discount_code=READ2026',
        slide11_title: 'В 2025 вы открывали много новых сюжетов, но в вашей библиотеке до сих пор лежат книги, которые ждут своего часа.',
        slide11_subtitle: 'Чтобы вам было проще не откладывать их на следующий год, мы дарим вам промокод READ2026 на скидку 20%: вы можете использовать его до пяти раз.',
        slide11_button_text: 'В��рнуться на Litnet',
        slide11_button_link: 'https://litnet.com'
      });
    }
    
    return c.json(statsObj);
  } catch (error) {
    console.error('[STATS] Error fetching stats content:', error);
    return c.json({ error: 'Failed to fetch stats content', details: String(error) }, 500);
  }
});

// Update stats content
app.post('/make-server-b7aac3cb/stats-content', async (c) => {
  try {
    console.log('[STATS] Received update request for stats content');
    
    // Read request body
    let statsData;
    try {
      const body = await c.req.text();
      if (!body || body.trim() === '') {
        console.error('[STATS] Request body is empty');
        return c.json({ error: 'Request body is empty' }, 400);
      }
      statsData = JSON.parse(body);
      console.log('[STATS] Parsed stats data successfully');
    } catch (parseError) {
      console.error('[STATS] Error parsing JSON:', parseError);
      return c.json({ error: 'Invalid JSON in request body' }, 400);
    }
    
    // Update each key-value pair
    for (const [key, value] of Object.entries(statsData)) {
      const { error } = await supabase
        .from('stats_content')
        .upsert({ 
          key, 
          value: String(value)
        }, {
          onConflict: 'key'
        });
      
      if (error) {
        console.error(`[STATS] Error updating key ${key}:`, error);
        throw error;
      }
    }
    
    console.log('[STATS] Stats content updated successfully');
    return c.json({ success: true });
  } catch (error) {
    console.error('[STATS] Error updating stats content:', error);
    return c.json({ error: 'Failed to update stats content', details: String(error) }, 500);
  }
});

// ===== HOMEPAGE CONTENT ROUTES =====

// Get all homepage content
app.get('/make-server-b7aac3cb/homepage-content', async (c) => {
  try {
    console.log('[HOMEPAGE] Fetching homepage content...');
    const { data, error } = await supabase
      .from('homepage_content')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      // If table doesn't exist, return default data
      if (error.code === 'PGRST116' || error.code === '42P01') {
        console.warn('[HOMEPAGE] Table does not exist, returning defaults');
        return c.json([
          {
            id: 1,
            landing_id: 'advent',
            title: 'Адвент-календарь 2025',
            description: 'Каждый день декабря — новый подарок от Литнета',
            button_text: 'Открыть календарь',
            background_type: 'advent',
            route: '/advent'
          },
          {
            id: 2,
            landing_id: 'stats',
            title: 'Итоги 2025',
            description: 'Ваш книжный год в одном месте',
            button_text: 'Посмотреть итоги',
            background_type: 'stats',
            route: '/stats'
          }
        ]);
      }
      console.error('[HOMEPAGE] Error fetching data:', error);
      throw error;
    }
    
    // If no data, return defaults
    if (!data || data.length === 0) {
      console.log('[HOMEPAGE] No data found, returning defaults');
      return c.json([
        {
          id: 1,
          landing_id: 'advent',
          title: 'Адвент-календарь 2025',
          description: 'Каждый день декабря — новый подарок от Литнета',
          button_text: 'Открыть календарь',
          background_type: 'advent',
          route: '/advent'
        },
        {
          id: 2,
          landing_id: 'stats',
          title: 'Итоги 2025',
          description: 'Ваш книжный год в одном месте',
          button_text: 'Посмотреть итоги',
          background_type: 'stats',
          route: '/stats'
        }
      ]);
    }
    
    console.log('[HOMEPAGE] Successfully fetched homepage content');
    return c.json(data);
  } catch (error) {
    console.error('[HOMEPAGE] Error:', error);
    return c.json({ error: 'Failed to fetch homepage content', details: String(error) }, 500);
  }
});

// Update homepage landing content
app.put('/make-server-b7aac3cb/homepage-content/:landingId', async (c) => {
  const landingId = c.req.param('landingId');
  
  try {
    console.log(`[HOMEPAGE] Received update request for landing: ${landingId}`);
    
    let updateData;
    try {
      const body = await c.req.text();
      if (!body || body.trim() === '') {
        console.error('[HOMEPAGE] Request body is empty');
        return c.json({ error: 'Request body is empty' }, 400);
      }
      updateData = JSON.parse(body);
      console.log('[HOMEPAGE] Parsed data successfully');
    } catch (parseError) {
      console.error('[HOMEPAGE] Error parsing JSON:', parseError);
      return c.json({ error: 'Invalid JSON in request body' }, 400);
    }
    
    const { error } = await supabase
      .from('homepage_content')
      .update(updateData)
      .eq('landing_id', landingId);
    
    if (error) {
      console.error('[HOMEPAGE] Error updating data:', error);
      throw error;
    }
    
    console.log('[HOMEPAGE] Updated successfully');
    return c.json({ success: true });
  } catch (error) {
    console.error('[HOMEPAGE] Error:', error);
    return c.json({ error: 'Failed to update homepage content', details: String(error) }, 500);
  }
});

// ===== SEO ROUTES =====

// Get Homepage SEO data
app.get('/make-server-b7aac3cb/homepage-seo', async (c) => {
  try {
    console.log('[HOMEPAGE-SEO] Fetching homepage SEO data...');
    const { data, error } = await supabase
      .from('homepage_seo')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) {
      // If table doesn't exist, return default values
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.warn('[HOMEPAGE-SEO] Table does not exist yet. Please run create_homepage_seo.sql');
        return c.json({
          meta_title: 'Litnet - Новогодние акции 2025',
          meta_description: 'Адвент-календарь и итоги 2025 года на Litnet. Выберите лендинг и откройте для себя праздничные сюрпризы!',
          meta_keywords: 'litnet, новый год, акции, адвент календарь, итоги года, 2025',
          og_title: 'Litnet - Новогодние акции 2025',
          og_description: 'Адвент-календарь и итоги 2025 года на Litnet. Выберите лендинг и откройте для себя праздничные сюрпризы!',
          og_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-homepage.jpg',
          og_url: 'https://litnet.com/',
          twitter_card: 'summary_large_image',
          twitter_title: 'Litnet - Новогодние акции 2025',
          twitter_description: 'Адвент-календарь и итоги 2025 года на Litnet. Выберите лендинг и откройте для себя праздничные сюрпризы!',
          twitter_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-homepage.jpg'
        });
      }
      console.error('[HOMEPAGE-SEO] Error fetching data:', error);
      throw error;
    }
    
    console.log('[HOMEPAGE-SEO] Successfully fetched homepage SEO data');
    return c.json(data);
  } catch (error) {
    console.error('[HOMEPAGE-SEO] Error:', error);
    return c.json({ error: 'Failed to fetch homepage SEO data', details: String(error) }, 500);
  }
});

// Update Homepage SEO data
app.put('/make-server-b7aac3cb/homepage-seo', async (c) => {
  try {
    console.log('[HOMEPAGE-SEO] Received update request');
    
    let updateData;
    try {
      const body = await c.req.text();
      if (!body || body.trim() === '') {
        console.error('[HOMEPAGE-SEO] Request body is empty');
        return c.json({ error: 'Request body is empty' }, 400);
      }
      updateData = JSON.parse(body);
      console.log('[HOMEPAGE-SEO] Parsed data successfully');
    } catch (parseError) {
      console.error('[HOMEPAGE-SEO] Error parsing JSON:', parseError);
      return c.json({ error: 'Invalid JSON in request body' }, 400);
    }
    
    const { error } = await supabase
      .from('homepage_seo')
      .update(updateData)
      .eq('id', 1);
    
    if (error) {
      // If table doesn't exist, inform user
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.error('[HOMEPAGE-SEO] Table does not exist. Please run create_homepage_seo.sql in Supabase');
        return c.json({ 
          error: 'Table homepage_seo does not exist',
          message: 'Please run create_homepage_seo.sql in your Supabase SQL Editor'
        }, 400);
      }
      console.error('[HOMEPAGE-SEO] Error updating data:', error);
      throw error;
    }
    
    console.log('[HOMEPAGE-SEO] Updated successfully');
    return c.json({ success: true });
  } catch (error) {
    console.error('[HOMEPAGE-SEO] Error:', error);
    return c.json({ error: 'Failed to update homepage SEO data', details: String(error) }, 500);
  }
});

// Get Advent SEO data
app.get('/make-server-b7aac3cb/advent-seo', async (c) => {
  try {
    console.log('[ADVENT-SEO] Fetching SEO data...');
    const { data, error } = await supabase
      .from('advent_seo')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) {
      // If table doesn't exist, return default values
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.warn('[ADVENT-SEO] Table does not exist yet. Please run create_seo_tables.sql');
        return c.json({
          meta_title: 'Адвент календарь 2025 | Litnet',
          meta_description: 'Открывайте подарки каждый день в адвент календаре Litnet 2025',
          meta_keywords: 'litnet, адвент календарь, 2025, книги, подарки',
          og_title: 'Адвент календарь 2025 | Litnet',
          og_description: 'Открывайте подарки каждый день в адвент календаре Litnet 2025',
          og_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-advent.jpg',
          og_url: 'https://litnet.com/advent',
          twitter_card: 'summary_large_image',
          twitter_title: 'Адвент календарь 2025 | Litnet',
          twitter_description: 'Открывайте подарки каждый день в адвент календаре Litnet 2025',
          twitter_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-advent.jpg'
        });
      }
      console.error('[ADVENT-SEO] Error fetching data:', error);
      throw error;
    }
    
    console.log('[ADVENT-SEO] Successfully fetched SEO data');
    return c.json(data);
  } catch (error) {
    console.error('[ADVENT-SEO] Error:', error);
    return c.json({ error: 'Failed to fetch Advent SEO data', details: String(error) }, 500);
  }
});

// Update Advent SEO data
app.put('/make-server-b7aac3cb/advent-seo', async (c) => {
  try {
    console.log('[ADVENT-SEO] Received update request');
    
    let seoData;
    try {
      const body = await c.req.text();
      if (!body || body.trim() === '') {
        console.error('[ADVENT-SEO] Request body is empty');
        return c.json({ error: 'Request body is empty' }, 400);
      }
      seoData = JSON.parse(body);
      console.log('[ADVENT-SEO] Parsed data successfully');
    } catch (parseError) {
      console.error('[ADVENT-SEO] Error parsing JSON:', parseError);
      return c.json({ error: 'Invalid JSON in request body' }, 400);
    }
    
    const { error } = await supabase
      .from('advent_seo')
      .update(seoData)
      .eq('id', 1);
    
    if (error) {
      console.error('[ADVENT-SEO] Error updating data:', error);
      throw error;
    }
    
    console.log('[ADVENT-SEO] Updated successfully');
    return c.json({ success: true });
  } catch (error) {
    console.error('[ADVENT-SEO] Error:', error);
    return c.json({ error: 'Failed to update Advent SEO data', details: String(error) }, 500);
  }
});

// Get Stats SEO data
app.get('/make-server-b7aac3cb/stats-seo', async (c) => {
  try {
    console.log('[STATS-SEO] Fetching SEO data...');
    const { data, error } = await supabase
      .from('stats_seo')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) {
      // If table doesn't exist, return default values
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.warn('[STATS-SEO] Table does not exist yet. Please run create_seo_tables.sql');
        return c.json({
          meta_title: 'Ваши итоги 2025 | Litnet',
          meta_description: 'Узнайте всё о вашей активности на Litnet в 2025 году',
          meta_keywords: 'litnet, итоги года, статистика, 2025, книги',
          og_title: 'Ваши итоги 2025 | Litnet',
          og_description: 'Узнайте всё о вашей активности на Litnet в 2025 году',
          og_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-stats.jpg',
          og_url: 'https://litnet.com/stats',
          twitter_card: 'summary_large_image',
          twitter_title: 'Ваши итоги 2025 | Litnet',
          twitter_description: 'Узнайте всё о вашей активности на Litnet в 2025 году',
          twitter_image_url: 'https://phyiwsserncatvhleuor.supabase.co/storage/v1/object/public/advent/og-image-stats.jpg'
        });
      }
      console.error('[STATS-SEO] Error fetching data:', error);
      throw error;
    }
    
    console.log('[STATS-SEO] Successfully fetched SEO data');
    return c.json(data);
  } catch (error) {
    console.error('[STATS-SEO] Error:', error);
    return c.json({ error: 'Failed to fetch Stats SEO data', details: String(error) }, 500);
  }
});

// Update Stats SEO data
app.put('/make-server-b7aac3cb/stats-seo', async (c) => {
  try {
    console.log('[STATS-SEO] Received update request');
    
    let seoData;
    try {
      const body = await c.req.text();
      if (!body || body.trim() === '') {
        console.error('[STATS-SEO] Request body is empty');
        return c.json({ error: 'Request body is empty' }, 400);
      }
      seoData = JSON.parse(body);
      console.log('[STATS-SEO] Parsed data successfully');
    } catch (parseError) {
      console.error('[STATS-SEO] Error parsing JSON:', parseError);
      return c.json({ error: 'Invalid JSON in request body' }, 400);
    }
    
    const { error } = await supabase
      .from('stats_seo')
      .update(seoData)
      .eq('id', 1);
    
    if (error) {
      console.error('[STATS-SEO] Error updating data:', error);
      throw error;
    }
    
    console.log('[STATS-SEO] Updated successfully');
    return c.json({ success: true });
  } catch (error) {
    console.error('[STATS-SEO] Error:', error);
    return c.json({ error: 'Failed to update Stats SEO data', details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);