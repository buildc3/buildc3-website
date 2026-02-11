import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Project } from '@/types/database';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async (): Promise<Project | null> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, category:categories(*)')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4 max-w-3xl w-full px-4">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-96 bg-muted rounded-2xl" />
          <div className="h-6 w-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-muted-foreground">Project not found</p>
        <Button variant="outline" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto flex items-center gap-4 px-6 py-4 max-w-[1600px]">
          <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
          </Button>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {project.thumbnail_url && (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full object-cover max-h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">{project.title}</h1>
            {project.category && (
              <Badge className="text-sm">{project.category.name}</Badge>
            )}
          </div>

          {project.description && (
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{project.description}</p>
          )}

          {project.external_link && (
            <Button asChild size="lg">
              <a href={project.external_link} target="_blank" rel="noopener noreferrer">
                Visit Project <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
