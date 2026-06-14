import { useEffect } from 'react';

const SITE_NAME = 'BuildC3';
const SITE_URL = 'https://buildc3.tech';
const DEFAULT_IMAGE = `${SITE_URL}/Screenshot%202026-03-27%20at%2016.41.16.png`;

export interface SeoProps {
  /** Page-specific title. Rendered as "Title | BuildC3" (or just "BuildC3" for the home page). */
  title: string;
  /** Meta description (~150–160 chars ideal). */
  description: string;
  /** Path of the current page, e.g. "/about". Used to build the canonical URL. */
  path: string;
  /** Optional social-share image (absolute URL). Falls back to the site default. */
  image?: string;
  /** If true, the title is used verbatim without the " | BuildC3" suffix. */
  exactTitle?: boolean;
  /** If true, asks crawlers not to index this page (e.g. 404). */
  noindex?: boolean;
}

/** Sets or creates a <meta> tag by name. */
function setMetaByName(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Sets or creates a <meta> tag by property (Open Graph). */
function setMetaByProperty(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Sets or creates the canonical <link>. */
function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Per-page SEO. Drop one <Seo /> near the top of each page to give it a unique
 * title, description, canonical URL and social-share metadata. This keeps every
 * route distinct in search results — a key signal Google uses when generating
 * Sitelinks.
 */
export function Seo({ title, description, path, image, exactTitle, noindex }: SeoProps) {
  useEffect(() => {
    const fullTitle = exactTitle
      ? title
      : title === SITE_NAME
        ? SITE_NAME
        : `${title} | ${SITE_NAME}`;
    const canonical = `${SITE_URL}${path === '/' ? '/' : path.replace(/\/$/, '')}`;
    const resolvedImage = image
      ? image.startsWith('http')
        ? image
        : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`
      : DEFAULT_IMAGE;
    const shareImage = resolvedImage;

    document.title = fullTitle;

    setMetaByName('description', description);
    setMetaByName(
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    setCanonical(canonical);

    setMetaByProperty('og:title', fullTitle);
    setMetaByProperty('og:description', description);
    setMetaByProperty('og:url', canonical);
    setMetaByProperty('og:image', shareImage);
    setMetaByProperty('og:type', 'website');

    setMetaByName('twitter:title', fullTitle);
    setMetaByName('twitter:description', description);
    setMetaByName('twitter:image', shareImage);
  }, [title, description, path, image, exactTitle, noindex]);

  return null;
}

export default Seo;
