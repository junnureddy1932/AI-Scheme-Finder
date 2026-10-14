import {
  User,
  UserProfile,
  Scheme,
  SchemeMatchResult,
  SavedScheme,
  TrackerItem,
  TrackerStatus,
  ChatMessage
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jansahayak_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

// --- Auth Endpoints ---
export async function apiRegister(email: string, password: string, preferred_language = 'en'): Promise<{ access_token: string; user: User }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, preferred_language }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(err.detail || 'Registration failed');
  }
  return res.json();
}

export async function apiLogin(email: string, password: string): Promise<{ access_token: string; user: User }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(err.detail || 'Invalid email or password');
  }
  return res.json();
}

export async function apiGetMe(): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Unauthorized');
  }
  return res.json();
}

// --- Profile Endpoints ---
export async function apiGetProfile(): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: getAuthHeaders(),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  } catch (err) {
    return null;
  }
}

export async function apiUpsertProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to update profile' }));
    throw new Error(err.detail || 'Failed to update profile');
  }
  return res.json();
}

export async function apiDeleteAccount(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to delete account');
  }
  return res.json();
}

// --- Scheme Endpoints ---
export async function apiGetSchemes(params?: {
  category?: string;
  state?: string;
  search?: string;
  government_level?: string;
}): Promise<Scheme[]> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.state) query.append('state', params.state);
  if (params?.search) query.append('search', params.search);
  if (params?.government_level) query.append('government_level', params.government_level);

  const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch schemes');
  return res.json();
}

export async function apiGetSchemeCategories(): Promise<{ category: string; count: number }[]> {
  const res = await fetch(`${API_BASE}/schemes/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function apiGetSchemeById(id: number | string): Promise<Scheme> {
  const res = await fetch(`${API_BASE}/schemes/${id}`);
  if (!res.ok) throw new Error('Scheme not found');
  return res.json();
}

export async function apiMatchSchemes(inlineProfile?: Partial<UserProfile>): Promise<SchemeMatchResult[]> {
  const res = await fetch(`${API_BASE}/schemes/match`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: inlineProfile ? JSON.stringify(inlineProfile) : JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to evaluate scheme eligibility');
  return res.json();
}

// --- Saved Schemes ---
export async function apiGetSavedSchemes(): Promise<SavedScheme[]> {
  const res = await fetch(`${API_BASE}/saved-schemes`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return [];
  return res.json();
}

export async function apiSaveScheme(schemeId: number): Promise<SavedScheme> {
  const res = await fetch(`${API_BASE}/saved-schemes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ scheme_id: schemeId }),
  });
  if (!res.ok) throw new Error('Failed to save scheme');
  return res.json();
}

export async function apiRemoveSavedScheme(schemeId: number): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/saved-schemes/${schemeId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to remove saved scheme');
  return res.json();
}

// --- Application Tracker ---
export async function apiGetTrackerItems(): Promise<TrackerItem[]> {
  const res = await fetch(`${API_BASE}/tracker`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateTrackerItem(data: {
  scheme_id: number;
  status: TrackerStatus;
  notes?: string;
  target_deadline?: string;
}): Promise<TrackerItem> {
  const res = await fetch(`${API_BASE}/tracker`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add scheme to application tracker');
  return res.json();
}

export async function apiUpdateTrackerItem(
  trackerId: number,
  data: { status?: TrackerStatus; notes?: string; target_deadline?: string }
): Promise<TrackerItem> {
  const res = await fetch(`${API_BASE}/tracker/${trackerId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update tracker item');
  return res.json();
}

export async function apiDeleteTrackerItem(trackerId: number): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/tracker/${trackerId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete tracker item');
  return res.json();
}

// --- Conversational AI Assistant ---
export async function apiChatWithAssistant(
  message: string,
  history: ChatMessage[] = [],
  language = 'en'
): Promise<{
  answer: string;
  cited_schemes: Scheme[];
  follow_up_suggestions: string[];
  disclaimer: string;
}> {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      message,
      conversation_history: history.map((h) => ({ role: h.role, content: h.content })),
      user_language: language,
    }),
  });
  if (!res.ok) throw new Error('Failed to communicate with AI assistant');
  return res.json();
}

// --- Admin Endpoints ---
export async function apiAdminGetSchemes(): Promise<Scheme[]> {
  const res = await fetch(`${API_BASE}/admin/schemes`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Admin authorization required');
  return res.json();
}

export async function apiAdminVerifyScheme(schemeId: number, sourceUrl: string): Promise<Scheme> {
  const res = await fetch(`${API_BASE}/admin/schemes/${schemeId}/verify?source_url=${encodeURIComponent(sourceUrl)}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to verify scheme');
  return res.json();
}
