import { useState } from 'react';
import type { Project } from '@/types/database';

function normalizeUrl(url: string): string {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
}

function screenshotUrl(externalLink: string): string {
  const url = normalizeUrl(externalLink);
  if (!url) return '';
  return `https://image.thum.io/get/width/800/crop/600/${url}`;
}

interface ProjectImageProps {
  project: Pick<Project, 'thumbnail_url' | 'external_link' | 'title'>;
  className?: string;
}

export function ProjectImage({ project, className }: ProjectImageProps) {
  const initialSrc = project.thumbnail_url
    ? project.thumbnail_url
    : screenshotUrl(project.external_link);

  const [src, setSrc] = useState(initialSrc);
  const [triedFallback, setTriedFallback] = useState(false);

  const handleError = () => {
    if (!triedFallback && project.external_link) {
      setSrc(screenshotUrl(project.external_link));
      setTriedFallback(true);
    }
  };

  if (!src) return null;

  return (
    <img
      src={src}
      alt={project.title}
      className={className}
      loading="lazy"
      onError={handleError}
    />
  );
}
