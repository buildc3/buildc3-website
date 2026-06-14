import { useQuery } from '@tanstack/react-query';

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  description: string;
  image_path: string;
}

interface TeamResponse {
  members: TeamMemberData[];
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async (): Promise<TeamMemberData[]> => {
      const response = await fetch('/api/team.json');
      const data: TeamResponse = await response.json();
      return data.members;
    },
  });
}
