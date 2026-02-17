import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useProjects } from '@/hooks/useProjects';
import { useCategories } from '@/hooks/useCategories';
import { AdminPanel } from '@/components/AdminPanel';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/database';
import logo from '@/assets/buildc3-logo.png';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

interface ProjectGlowCardProps {
  project: Project;
}

function ProjectGlowCard({ project }: ProjectGlowCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      className="cursor-pointer mb-4"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div className="relative rounded-[1.25rem] border-[0.75px] border-border p-1.5 md:rounded-[1.5rem] md:p-2">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex flex-col rounded-xl border-[0.75px] bg-background shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] overflow-hidden">
          {project.thumbnail_url && (
            <div className="relative w-full">
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-auto object-cover block"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Content */}
          <div className="relative flex flex-col gap-2 p-4">
            <h3 className="text-sm leading-snug font-semibold tracking-[-0.01em] text-foreground line-clamp-2">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-1">
              {project.category && (
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                  {project.category.name}
                </Badge>
              )}
              {project.external_link && (
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Distribute items into N columns for a true Pinterest-style layout without CSS columns */
function useColumnDistribution<T>(items: T[], columnCount: number): T[][] {
  return useMemo(() => {
    const cols: T[][] = Array.from({ length: columnCount }, () => []);
    items.forEach((item, i) => {
      cols[i % columnCount].push(item);
    });
    return cols;
  }, [items, columnCount]);
}

/** Responsive column count hook */
function useResponsiveColumns(): number {
  const [cols, setCols] = useState(() => getColumns());

  React.useEffect(() => {
    const onResize = () => setCols(getColumns());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return cols;
}

function getColumns(): number {
  if (typeof window === 'undefined') return 3;
  const w = window.innerWidth;
  if (w >= 1280) return 5;
  if (w >= 1024) return 4;
  if (w >= 768) return 3;
  return 2;
}

const Projects = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const { data: projects = [], isLoading } = useProjects(
    selectedCategory ?? undefined,
    search || undefined
  );
  const { data: categories = [] } = useCategories();

  const columnCount = useResponsiveColumns();
  const columns = useColumnDistribution(projects, columnCount);

  const clickTimestamps = useRef<number[]>([]);
  const handleLogoClick = useCallback(() => {
    const now = Date.now();
    clickTimestamps.current.push(now);
    clickTimestamps.current = clickTimestamps.current.filter(t => now - t < 2000);
    if (clickTimestamps.current.length >= 5) {
      clickTimestamps.current = [];
      setAdminOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="relative">
          <button
            onClick={() => navigate('/')}
            className="absolute left-8 top-1/2 -translate-y-1/2 shrink-0 flex items-center gap-2 px-3 py-2 text-base text-muted-foreground hover:text-foreground transition-colors z-10 border border-border rounded-full hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="mx-auto flex items-center gap-4 px-6 py-4 max-w-[1600px]">
            <button onClick={handleLogoClick} className="shrink-0 select-none">
              <img src={logo} alt="BUILDC3" className="h-12 w-auto" />
            </button>
            
            <span className="text-2xl font-bold text-foreground">
              BUILDC3 : in, with and for the community
            </span>
          </div>
        </div>
      </nav>

      {/* Category Bar with Search */}
      <div className="sticky top-[65px] z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 py-3 flex items-center gap-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar flex-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              )}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap',
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-xs shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 rounded-full bg-secondary border-none focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="mx-auto max-w-[1600px] px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            All Projects
          </h1>
          <p className="mt-2 text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? 's' : ''} found
          </p>
        </motion.div>
      </div>

      {/* Projects Masonry Grid */}
      <main className="mx-auto max-w-[1600px] px-6 pb-12">
        {isLoading ? (
          <div className="flex gap-4">
            {Array.from({ length: columnCount }).map((_, col) => (
              <div key={col} className="flex-1 flex flex-col gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i}>
                    <div
                      className="rounded-[1.25rem] border border-border p-2 md:p-3"
                      style={{ height: `${180 + ((col + i) % 4) * 60}px` }}
                    >
                      <div className="h-full rounded-xl bg-muted animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg font-semibold">No projects found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="flex gap-4 items-start">
            {columns.map((colProjects, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col gap-4 min-w-0">
                {colProjects.map(project => (
                  <ProjectGlowCard key={project.id} project={project} />
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
};

export default Projects;
