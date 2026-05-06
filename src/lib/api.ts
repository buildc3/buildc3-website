import type { Project, Category, CommunityMember } from '@/types/database';

// In production: use static JSON files; In development: use local SQLite server
const IS_DEV = import.meta.env.DEV;
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Fetch static JSON (production) or from API (development)
async function fetchData<T>(endpoint: string): Promise<T> {
  if (IS_DEV) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error ?? res.statusText);
    }
    return res.json() as Promise<T>;
  }
  // Production: fetch static JSON
  const res = await fetch(`/api${endpoint}.json`);
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json() as Promise<T>;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!IS_DEV && options?.method && options.method !== 'GET') {
    throw new Error('Write operations only available in development mode');
  }
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

interface ProjectInput {
  title: string;
  description: string;
  thumbnail_url: string;
  external_link: string;
  category_ids: number[];
}

interface MemberInput {
  name: string;
  role: string;
  image_url: string;
  cover_image_url: string;
  linkedin_url: string;
  portfolio_url: string;
  display_order: number;
}

export const api = {
  // Projects (read uses static JSON in prod)
  getProjects: () => fetchData<Project[]>('/projects'),
  createProject: (data: ProjectInput) =>
    request<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: number, data: ProjectInput) =>
    request<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: number) =>
    request<{ success: boolean }>(`/projects/${id}`, { method: 'DELETE' }),

  // Categories (read uses static JSON in prod)
  getCategories: () => fetchData<Category[]>('/categories'),
  createCategory: (data: { name: string; display_order: number }) =>
    request<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  deleteCategory: (id: number) =>
    request<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),

  // Community Members (read uses static JSON in prod)
  getCommunity: () => fetchData<CommunityMember[]>('/community'),
  createMember: (data: MemberInput) =>
    request<CommunityMember>('/community', { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (id: number, data: MemberInput) =>
    request<CommunityMember>(`/community/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMember: (id: number) =>
    request<{ success: boolean }>(`/community/${id}`, { method: 'DELETE' }),
};
