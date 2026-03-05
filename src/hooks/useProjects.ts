import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types/database';

export function useProjects(categoryId?: number, search?: string) {
  return useQuery({
    queryKey: ['projects', categoryId, search],
    queryFn: async (): Promise<Project[]> => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          project_categories(
            category:categories(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Transform the data to include categories array
      const projects = (data ?? []).map(project => ({
        ...project,
        categories: project.project_categories?.map(pc => pc.category).filter(Boolean) ?? [],
      }));

      // Filter by category if provided
      if (categoryId) {
        return projects.filter(project => 
          project.categories?.some(cat => cat.id === categoryId)
        );
      }

      return projects;
    },
  });
}
