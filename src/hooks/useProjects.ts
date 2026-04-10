import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Project } from '@/types/database';

export function useProjects(categoryId?: number, search?: string) {
  return useQuery({
    queryKey: ['projects', categoryId, search],
    queryFn: async (): Promise<Project[]> => {
      const projects = await api.getProjects();

      let filtered = projects;

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q));
      }

      if (categoryId) {
        filtered = filtered.filter(p =>
          p.categories?.some(cat => cat.id === categoryId)
        );
      }

      return filtered;
    },
  });
}
