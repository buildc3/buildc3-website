import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/ProjectCard';

interface MasonryGridProps {
  categoryId: string | null;
  search: string;
}

export function MasonryGrid({ categoryId, search }: MasonryGridProps) {
  const { data: projects = [], isLoading } = useProjects(
    categoryId ?? undefined,
    search || undefined
  );

  if (isLoading) {
    return (
      <div className="masonry-grid px-4 max-w-7xl mx-auto py-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="masonry-item">
            <div className="rounded-2xl bg-muted animate-pulse" style={{ height: `${200 + (i % 3) * 80}px` }} />
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-semibold">No projects found</p>
        <p className="text-sm">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid px-4 max-w-7xl mx-auto py-6">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
