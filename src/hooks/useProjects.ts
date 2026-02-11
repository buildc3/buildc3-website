import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types/database';

export function useProjects(categoryId?: string, search?: string) {
  return useQuery({
    queryKey: ['projects', categoryId, search],
    queryFn: async (): Promise<Project[]> => {
      let query = supabase
        .from('projects')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}
