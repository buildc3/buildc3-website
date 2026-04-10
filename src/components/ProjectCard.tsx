import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ProjectImage } from '@/components/ProjectImage';
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
        <ProjectImage
          project={project}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="p-3">
          <h3 className="font-bold text-sm text-card-foreground line-clamp-2">{project.title}</h3>
          {project.categories && project.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {project.categories.map(category => (
                <Badge key={category.id} variant="secondary" className="text-xs">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
