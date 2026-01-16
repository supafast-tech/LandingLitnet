import { projectId, publicAnonKey } from './supabase/info';
import { LandingSettings } from './settings';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-b7aac3cb`;

const headers = {
  'Authorization': `Bearer ${publicAnonKey}`,
  'Content-Type': 'application/json'
};

// Check if API is available
let apiAvailable = true;

async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`, { headers });
    return response.ok;
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
}

// ===== SETTINGS API =====

export async function fetchGlobalSettings(): Promise<LandingSettings> {
  try {
    const response = await fetch(`${API_BASE}/settings`, { 
      headers,
      method: 'GET'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error('Failed to fetch settings:', errorData);
      throw new Error(`Failed to fetch settings: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Fetched global settings successfully');
    return data;
  } catch (error) {
    console.error('Error fetching global settings:', error);
    throw error;
  }
}

export async function updateGlobalSettings(settings: LandingSettings): Promise<void> {
  try {
    console.log('Updating global settings:', settings);
    const response = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error('Failed to update settings:', errorData);
      throw new Error(`Failed to update settings: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Settings updated successfully:', result);
  } catch (error) {
    console.error('Error updating global settings:', error);
    throw error;
  }
}

// ===== CALENDAR DAYS API =====

export interface CalendarDay {
  day: number;
  title: string;
  subtitle: string;
  giftType: 'promo' | 'discount' | 'bonus';
  promoCode: string;
  promoDescription: string;
  promoDisclaimer: string;
  discount: string;
  bonusAmount: string;
  bonusDescription: string;
  hoverLabel: string;
  lockedMessage: string;
  pastMessage: string;
  buttonLink: string;
  buttonText: string;
  downloadFile: boolean;
  // Второй промокод (опциоально)
  promoCode2?: string;
  promoDisclaimer2?: string;
  buttonLink2?: string;
  buttonText2?: string;
  downloadFile2?: boolean;
  popupType?: 'single_promo' | 'double_promo' | 'download'; // Тип попапа
}

export async function fetchAllCalendarDays(): Promise<CalendarDay[]> {
  try {
    const response = await fetch(`${API_BASE}/calendar-days`, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar days: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching calendar days:', error);
    throw error;
  }
}

export async function fetchCalendarDay(day: number): Promise<CalendarDay> {
  try {
    const response = await fetch(`${API_BASE}/calendar-days/${day}`, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar day: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching calendar day ${day}:`, error);
    throw error;
  }
}

export async function updateCalendarDay(day: number, data: CalendarDay): Promise<void> {
  try {
    console.log(`Updating calendar day ${day}:`, data);
    const response = await fetch(`${API_BASE}/calendar-days/${day}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error(`Failed to update calendar day ${day}:`, errorData);
      throw new Error(`Failed to update calendar day: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`Calendar day ${day} updated successfully:`, result);
  } catch (error) {
    console.error(`Error updating calendar day ${day}:`, error);
    throw error;
  }
}

export async function initializeCalendarDays(): Promise<void> {
  try {
    console.log('[CLIENT] Sending calendar initialization request...');
    const response = await fetch(`${API_BASE}/calendar-days/init`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error('[CLIENT] Failed to initialize calendar days:', errorData);
      // Don't throw - this is not critical, data comes from DB anyway
      console.warn('[CLIENT] Continuing - calendar data will be loaded from database');
      return;
    }
    
    const result = await response.json();
    console.log('[CLIENT] Calendar days initialization result:', result);
    
    if (result.success) {
      console.log('[CLIENT] Calendar initialization successful:', result.message);
    } else if (result.error) {
      console.warn('[CLIENT] Calendar initialization warning:', result.error);
    }
  } catch (error) {
    console.error('[CLIENT] Error initializing calendar days:', error);
    // Don't throw - allow app to continue, data will be loaded from database
    console.warn('[CLIENT] Continuing - calendar data will be loaded from database');
  }
}

// ===== CONTENT API =====

export interface ContentData {
  [key: string]: string | boolean | undefined;
}

export async function fetchContent(): Promise<ContentData> {
  try {
    const response = await fetch(`${API_BASE}/content`, { headers });
    
    if (!response.ok) {
      console.warn('Failed to fetch content from server, using empty defaults');
      return {};
    }
    
    const data = await response.json();
    console.log('Fetched content successfully');
    return data;
  } catch (error) {
    console.warn('Error fetching content, using empty defaults:', error);
    return {};
  }
}

export async function updateContent(key: string, value: string): Promise<void> {
  try {
    console.log(`Updating content key ${key}:`, value);
    const response = await fetch(`${API_BASE}/content/${key}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ value })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error(`Failed to update content key ${key}:`, errorData);
      
      // Provide more helpful error message
      if (errorData.details && errorData.details.includes('does not exist')) {
        throw new Error(`Database table 'advent_content' does not exist. Please run /sql/create_advent_content.sql in Supabase SQL Editor.`);
      }
      
      if (errorData.details && errorData.details.includes('category') && errorData.details.includes('not-null')) {
        throw new Error(`Database error: column 'category' requires a default value. Please run /sql/fix_advent_content.sql in Supabase SQL Editor to fix this.`);
      }
      
      throw new Error(`Failed to update content: ${errorData.details || errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`Content key ${key} updated successfully:`, result);
  } catch (error) {
    console.error(`Error updating content key ${key}:`, error);
    throw error;
  }
}