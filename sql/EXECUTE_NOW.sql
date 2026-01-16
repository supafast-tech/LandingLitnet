-- ========================================
-- ШАГ 1: Добавить колонки (выполнить один раз)
-- ========================================

ALTER TABLE advent_calendar 
ADD COLUMN IF NOT EXISTS gift_value_2 TEXT,
ADD COLUMN IF NOT EXISTS valid_until_text_2 TEXT,
ADD COLUMN IF NOT EXISTS button_link_2 TEXT,
ADD COLUMN IF NOT EXISTS button_text_2 TEXT,
ADD COLUMN IF NOT EXISTS download_file_2 BOOLEAN DEFAULT false;

-- ========================================
-- ШАГ 2: Обновить день 19 с двумя промокодами
-- ========================================

UPDATE advent_calendar
SET 
  title = 'Двойной подарок!',
  description = 'Для тех, кто любит пошуршать страничками и потом дочитать историю с экрана, мы приготовили двойной подарок. Промокод на скидку на печатную книгу «Дуэльный сезон» и дополнительная скидка 10% на электронную версию: соберите полный комплект.',
  gift_type = 'promo',
  gift_value = 'DUEL10',
  gift_value_2 = 'МАРИНБУРГ',
  valid_until_text = 'На электронную книгу',
  valid_until_text_2 = 'На печатную книгу',
  button_link = 'https://litnet.com',
  button_link_2 = 'https://litnet.com',
  button_text = 'Применить промокод',
  button_text_2 = 'Применить промокод',
  download_file = false,
  download_file_2 = false,
  is_active = true,
  updated_at = NOW()
WHERE day = 19;

-- ========================================
-- ГОТОВО! Проверьте результат:
-- ========================================

SELECT day, title, gift_value, gift_value_2, 
       valid_until_text, valid_until_text_2
FROM advent_calendar 
WHERE day = 19;
