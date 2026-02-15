import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { HoverGlowCard } from '@/components/ui/hover-glow-card';
import type { Project } from '@/types/database';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="masonry-item cursor-pointer"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <HoverGlowCard>
        {project.thumbnail_url && (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="p-3">
          <h3 className="font-bold text-sm text-card-foreground line-clamp-2">{project.title}</h3>
          {project.category && (
            <Badge variant="secondary" className="mt-1.5 text-xs">
              {project.category.name}
            </Badge>
          )}
        </div>
      </HoverGlowCard>
    </div>
  );
}
