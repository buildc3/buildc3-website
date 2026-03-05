import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { CommunityMember } from '@/types/database';

export function useCommunityMembers() {
  return useQuery({
    queryKey: ['community_members'],
    queryFn: async (): Promise<CommunityMember[]> => {
      const { data, error } = await supabase
        .from('community_members')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}
