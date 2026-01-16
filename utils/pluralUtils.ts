// Utility functions for Russian plural forms

export function getBookWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'книг';
  }

  if (lastDigit === 1) {
    return 'книгу';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'книги';
  }

  return 'книг';
}

export function getSubscriptionWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'подписок';
  }

  if (lastDigit === 1) {
    return 'подписку';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'подписки';
  }

  return 'подписок';
}

export function getPagesWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'страниц';
  }

  if (lastDigit === 1) {
    return 'страницу';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'страницы';
  }

  return 'страниц';
}

export function getAwardWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'наград';
  }

  if (lastDigit === 1) {
    return 'награду';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'награды';
  }

  return 'наград';
}