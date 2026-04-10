import { useState } from 'react';
import type { Project } from '@/types/database';

// Deterministic gradient per project based on title characters
function getGradient(title: string): string {
  const gradients = [
    'from-violet-600 to-indigo-600',
    'from-blue-600 to-cyan-500',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-pink-600',
    'from-rose-500 to-purple-600',
    'from-sky-500 to-blue-700',
    'from-fuchsia-500 to-violet-700',
    'from-amber-500 to-orange-600',
  ];
  const idx = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;
  return gradients[idx];
}

function normalizeUrl(url: string): string {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
}

interface ProjectImageProps {
  project: Pick<Project, 'thumbnail_url' | 'external_link' | 'title'>;
  className?: string;
}

function ProjectPlaceholder({ project }: { project: Pick<Project, 'thumbnail_url' | 'external_link' | 'title'> }) {
  const gradient = getGradient(project.title);
  const href = normalizeUrl(project.external_link);
  const initials = project.title
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className={`w-full aspect-video bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-3 p-4`}>
      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-xl select-none">
        {initials}
      </div>
      <span className="text-white font-semibold text-sm text-center leading-tight px-2 line-clamp-2">
        {project.title}
      </span>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="text-white/80 text-xs border border-white/30 rounded-full px-3 py-1 hover:bg-white/20 transition-colors"
        >
          Visit site →
        </a>
      )}
    </div>
  );
}

export function ProjectImage({ project, className }: ProjectImageProps) {
  const [imgError, setImgError] = useState(false);

  if (!project.thumbnail_url || imgError) {
    return <ProjectPlaceholder project={project} />;
  }

  return (
    <img
      src={project.thumbnail_url}
      alt={project.title}
      className={className}
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
}
