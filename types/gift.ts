export interface Gift {
  id: number;
  date: string; // YYYY-MM-DD format
  title: string;
  description: string;
  promoCode: string;
  promoDisclaimer?: string; // Дисклеймер под промокодом (например: "скидка действует до...")
  buttonLink: string;
  buttonText?: string; // Текст кнопки (по умолчанию "Перейти к подарку")
  downloadFile?: boolean; // Флаг: true = скачать файл, false = открыть ссылку
  // Второй промокод (опционально)
  promoCode2?: string;
  promoDisclaimer2?: string;
  buttonLink2?: string;
  buttonText2?: string;
  downloadFile2?: boolean;
  enabled: boolean;
  hoverLabel?: string; // Подпись дня при ховере
  popupType?: 'single_promo' | 'double_promo' | 'download'; // Тип попапа
}

export type DayStatus = 'past' | 'current' | 'future';