import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useProjects } from '@/hooks/useProjects';
import { useCategories } from '@/hooks/useCategories';
import { useDesigns } from '@/hooks/useDesigns';
import { SiteHeader } from '@/components/SiteHeader';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/database';

const DESIGN_CATEGORY_IDS = { '3D Renders': 7, 'Our Designs': 8 } as const;
const DESIGN_FOLDER_MAP: Record<number, '3d-renders' | 'our-designs'> = {
  7: '3d-renders',
  8: 'our-designs',
};

const itemVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.2,
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
      <div className="relative rounded-[1.25rem] border-2 border-[#9F8064]/80 p-1.5 md:rounded-[1.5rem] md:p-2">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="group relative flex flex-col rounded-xl border border-[#9F8064]/40 bg-background shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] overflow-hidden">
          {project.thumbnail_url && (
            <div className="relative w-full overflow-hidden">
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-auto object-cover block transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Content */}
          <div className="relative flex flex-col gap-2 p-4">
            <h3 className="text-base md:text-lg leading-snug font-semibold tracking-[-0.01em] text-foreground line-clamp-2">
              {project.title}
            </h3>
            {project.star_point && (
              <span className="text-xs md:text-sm font-semibold text-primary brightness-75 dark:brightness-110 uppercase tracking-wider">
                {project.star_point}
              </span>
            )}
            {project.description && (
              <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-1">
              <div className="flex flex-wrap gap-1">
                {project.categories && project.categories.length > 0 && (
                  project.categories.map(category => (
                    <Badge key={category.id} variant="secondary" className="text-[10px] px-2 py-0.5">
                      {category.name}
                    </Badge>
                  ))
                )}
              </div>
              {project.external_link && (
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DesignGallery({ folder }: { folder: '3d-renders' | 'our-designs' }) {
  const { data: images = [], isLoading } = useDesigns(folder);

  if (isLoading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mb-4 rounded-xl bg-muted animate-pulse" style={{ height: `${160 + (i % 3) * 60}px` }} />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-semibold">No images yet</p>
        <p className="text-sm">Add images to <code className="text-xs bg-muted px-1 py-0.5 rounded">public/designs/{folder}/</code> and update <code className="text-xs bg-muted px-1 py-0.5 rounded">public/designs/manifest.json</code></p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {images.map((src, i) => (
        <motion.div
          key={src}
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="mb-4 break-inside-avoid"
        >
          <div className="relative rounded-[1.25rem] border-2 border-[#9F8064]/80 p-1.5 overflow-hidden">
            <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} />
            <img
              src={src}
              alt={`Design ${i + 1}`}
              className="w-full rounded-xl object-cover block"
              loading="lazy"
              draggable={false}
            />
          </div>
        </motion.div>
      ))}
    </div>
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
  if (w >= 1280) return 3;
  if (w >= 1024) return 2;
  return 1;
}

const Projects = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const { data: projects = [], isLoading } = useProjects(
    selectedCategory ?? undefined
  );
  const { data: categories = [] } = useCategories();

  const columnCount = useResponsiveColumns();
  const columns = useColumnDistribution(projects, columnCount);

  const selectedCategoryName = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.name
    : 'All';

  const designFolder = selectedCategory ? DESIGN_FOLDER_MAP[selectedCategory] : null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Projects Masonry Grid */}
      <main className="mx-auto max-w-screen-2xl px-6 md:px-12 pt-12 pb-12">
        {/* Intro text */}
        <div className="mb-12 mt-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 60, scale: 0.85, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight leading-tight mb-5"
            style={{ color: '#9F8064' }}
          >
            Our Work
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
            className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light"
          >
            BuildC3 has excelled and has bagged some fabulous projects, from scaling to 40k+ users, to making our clients super happy, while keeping the main aim intact,{' '}
            <span className="font-semibold" style={{ color: '#9F8064' }}>to Help and Build for the Community!</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="mt-8 border-t border-black/10"
          />
        </div>

        {/* Category Bar - Desktop */}
        <div className="hidden md:flex items-center gap-4 mb-8">
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
        </div>

        {/* Category Bar - Mobile */}
        <div className="flex md:hidden flex-col gap-3 mb-8">
          {/* Category dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-secondary text-sm font-semibold"
            >
              <span>{selectedCategoryName}</span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                categoryDropdownOpen ? "rotate-180" : ""
              )} />
            </button>

            {categoryDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setCategoryDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCategoryDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full px-4 py-3 text-left text-sm font-medium transition-colors',
                      selectedCategory === null
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCategoryDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full px-4 py-3 text-left text-sm font-medium transition-colors',
                        selectedCategory === cat.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {designFolder ? (
          <DesignGallery folder={designFolder} />
        ) : isLoading ? (
          <div className="flex gap-4">
            {Array.from({ length: columnCount }).map((_, col) => (
              <div key={col} className="flex-1 flex flex-col gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i}>
                    <div
                      className="rounded-[1.25rem] border border-[#9F8064]/40 p-2 md:p-3"
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
    </div>
  );
};

export default Projects;
