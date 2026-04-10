import type { Project, Category, CommunityMember } from '@/types/database';

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
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
  // Projects
  getProjects: () => request<Project[]>('/projects'),
  createProject: (data: ProjectInput) =>
    request<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: number, data: ProjectInput) =>
    request<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: number) =>
    request<{ success: boolean }>(`/projects/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => request<Category[]>('/categories'),
  createCategory: (data: { name: string; display_order: number }) =>
    request<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  deleteCategory: (id: number) =>
    request<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),

  // Community Members
  getCommunity: () => request<CommunityMember[]>('/community'),
  createMember: (data: MemberInput) =>
    request<CommunityMember>('/community', { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (id: number, data: MemberInput) =>
    request<CommunityMember>(`/community/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMember: (id: number) =>
    request<{ success: boolean }>(`/community/${id}`, { method: 'DELETE' }),
};
