import type { Project, Category, CommunityMember } from '@/types/database';

// Read-only static JSON API. Data lives in public/api/*.json and is edited by hand.
async function fetchData<T>(endpoint: string): Promise<T> {
  const res = await fetch(`/api${endpoint}.json`);
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json() as Promise<T>;
}

export const api = {
  getProjects: () => fetchData<Project[]>('/projects'),
  getCategories: () => fetchData<Category[]>('/categories'),
  getCommunity: () => fetchData<CommunityMember[]>('/community'),
};
