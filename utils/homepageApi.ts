import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b7aac3cb`;

export interface HomepageLanding {
  id?: number;
  landing_id: string; // 'advent' or 'stats'
  title: string;
  description: string;
  button_text: string;
  background_type: 'advent' | 'stats';
  route: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch all homepage content
export async function fetchHomepageContent(): Promise<HomepageLanding[]> {
  try {
    const response = await fetch(`${API_URL}/homepage-content`, {
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
    console.error('[fetchHomepageContent] Error:', error);
    throw error;
  }
}

// Update homepage landing content
export async function updateHomepageLanding(landingId: string, data: Partial<HomepageLanding>): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/homepage-content/${landingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('[updateHomepageLanding] Error:', error);
    throw error;
  }
}
