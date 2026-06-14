import { useQuery } from '@tanstack/react-query';

interface DesignManifest {
  '3d-renders': string[];
  'our-designs': string[];
}

async function fetchDesignManifest(): Promise<DesignManifest> {
  const res = await fetch('/designs/manifest.json');
  if (!res.ok) throw new Error('Failed to fetch designs manifest');
  return res.json();
}

export function useDesigns(folder: '3d-renders' | 'our-designs') {
  return useQuery({
    queryKey: ['designs', folder],
    queryFn: async () => {
      const manifest = await fetchDesignManifest();
      return manifest[folder].map(filename => `/designs/${folder}/${filename}`);
    },
  });
}
