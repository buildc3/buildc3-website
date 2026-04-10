import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CommunityMember } from '@/types/database';

export function useCommunityMembers() {
  return useQuery({
    queryKey: ['community_members'],
    queryFn: (): Promise<CommunityMember[]> => api.getCommunity(),
  });
}
