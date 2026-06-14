import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProjectParallaxSlider } from '@/components/ui/project-parallax-slider';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Seo } from '@/components/Seo';
import type { Project } from '@/types/database';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id ? parseInt(id, 10) : null;

  // Fetch ALL projects so the slider can scroll between them
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['all-projects'],
    queryFn: (): Promise<Project[]> => api.getProjects(),
  });

  // Find the index of the clicked project
  const startIndex = projects.findIndex((p) => p.id === projectId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/50 text-sm uppercase tracking-widest font-semibold">
            Loading project…
          </p>
        </div>
      </div>
    );
  }

  if (projects.length === 0 || startIndex === -1) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-white/60">Project not found</p>
        <Button variant="outline" onClick={() => navigate('/projects')} className="border-white/20 text-white hover:bg-white/10">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
        </Button>
      </div>
    );
  }

  const current = projects[startIndex];

  return (
    <>
      {current && (
        <Seo
          title={current.title}
          path={`/project/${current.id}`}
          description={
            current.description
              ? `${current.description}`.slice(0, 160)
              : `${current.title} — a project built by the BuildC3 community.`
          }
          image={current.thumbnail_url || undefined}
        />
      )}
      <ProjectParallaxSlider projects={projects} startIndex={startIndex} />
    </>
  );
}
