import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b7aac3cb`;

export interface SeoData {
  id?: number;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  og_url: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image_url: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch Advent SEO data
export async function fetchAdventSeo(): Promise<SeoData> {
  try {
    const response = await fetch(`${API_URL}/advent-seo`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchAdventSeo] Error:', error);
    throw error;
  }
}

// Update Advent SEO data
export async function updateAdventSeo(seoData: Partial<SeoData>): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/advent-seo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(seoData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('[updateAdventSeo] Error:', error);
    throw error;
  }
}

// Fetch Stats SEO data
export async function fetchStatsSeo(): Promise<SeoData> {
  try {
    const response = await fetch(`${API_URL}/stats-seo`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchStatsSeo] Error:', error);
    throw error;
  }
}

// Update Stats SEO data
export async function updateStatsSeo(seoData: Partial<SeoData>): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/stats-seo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(seoData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('[updateStatsSeo] Error:', error);
    throw error;
  }
}

// Fetch Homepage SEO data
export async function fetchHomepageSeo(): Promise<SeoData> {
  try {
    const response = await fetch(`${API_URL}/homepage-seo`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchHomepageSeo] Error:', error);
    throw error;
  }
}

// Update Homepage SEO data
export async function updateHomepageSeo(seoData: Partial<SeoData>): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/homepage-seo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(seoData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('[updateHomepageSeo] Error:', error);
    throw error;
  }
}