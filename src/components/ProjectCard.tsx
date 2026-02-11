import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/types/database';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="masonry-item cursor-pointer group"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div className="rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-lg transition-shadow duration-300">
        {project.thumbnail_url && (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
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
      </div>
    </div>
  );
}
