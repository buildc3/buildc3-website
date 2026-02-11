import { useState } from 'react';
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
import { useRef, useCallback } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
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
    <motion.li
      variants={itemVariants}
      className="list-none cursor-pointer break-inside-avoid mb-4"
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
        <div className="relative flex flex-col overflow-hidden rounded-xl border-[0.75px] bg-background shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
          {/* Thumbnail - natural height */}
          {project.thumbnail_url && (
            <div className="relative w-full overflow-hidden">
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
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
    </motion.li>
  );
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
        <div className="mx-auto flex items-center gap-4 px-6 py-4 max-w-[1600px]">
          <button
            onClick={() => navigate('/')}
            className="shrink-0 flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button onClick={handleLogoClick} className="shrink-0 select-none">
            <img src={logo} alt="BUILDC3" className="h-9 w-auto" />
          </button>

          <div className="relative flex-1 max-w-md ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 rounded-full bg-secondary border-none focus-visible:ring-primary"
            />
          </div>
        </div>
      </nav>

      {/* Category Bar */}
      <div className="sticky top-[65px] z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 py-3 flex gap-2 overflow-x-auto hide-scrollbar">
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
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div
                  className="rounded-[1.25rem] border border-border p-2 md:p-3"
                  style={{ height: `${180 + (i % 4) * 60}px` }}
                >
                  <div className="h-full rounded-xl bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg font-semibold">No projects found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        ) : (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4"
          >
            {projects.map(project => (
              <ProjectGlowCard key={project.id} project={project} />
            ))}
          </motion.ul>
        )}
      </main>

      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
};

export default Projects;
