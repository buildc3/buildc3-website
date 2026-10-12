import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { SiteHeader } from '@/components/SiteHeader';
import { Seo } from '@/components/Seo';
import { useProjects } from '@/hooks/useProjects';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useIsMobile } from '@/hooks/use-mobile';

const BADGE_TRAVEL = 140; // px of scroll over which the badge flies into the header

/** Hero badge that shrinks and flies into the header logo slot as the page scrolls. */
const FlyingBadge = () => {
  const slotRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const update = () => {
      const slot = slotRef.current;
      const badge = badgeRef.current;
      const target = document.querySelector<HTMLElement>('[data-header-logo]');
      if (!slot || !badge || !target) return;

      const t = Math.min(Math.max(window.scrollY / BADGE_TRAVEL, 0), 1);
      const p = t * t * (3 - 2 * t); // smoothstep
      const from = slot.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const lerp = (a: number, b: number) => a + (b - a) * p;

      const size = lerp(from.width, Math.min(to.width, to.height));
      const x = lerp(from.left + (from.width - size) / 2, to.left + (to.width - size) / 2);
      const y = lerp(from.top, to.top + (to.height - size) / 2);
      badge.style.width = `${size}px`;
      badge.style.height = `${size}px`;
      badge.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      badge.style.opacity = '1';
      badge.style.pointerEvents = t >= 1 ? 'auto' : 'none';
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <div ref={slotRef} className="mx-auto h-44 w-44" />
      <img
        ref={badgeRef}
        src="/mobile-hero/badge.png"
        alt="BuildC3 — in the community, for the community, with the community"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed left-0 top-0 z-[101] object-contain opacity-0"
        style={{ willChange: 'transform, width, height' }}
      />
    </>
  );
};

const MOBILE_PEEPS = [
  { src: 'p1', left: 1.18, top: -1.86, width: 41.76, delay: 0.0 },
  { src: 'p2', left: 58.24, top: 4.19, width: 38.82, delay: 0.2 },
  { src: 'p3', left: 2.35, top: 22.79, width: 41.18, delay: 0.4 },
  { src: 'p4', left: 45.29, top: 25.12, width: 24.71, delay: 0.6 },
  { src: 'p5', left: 67.65, top: 30.23, width: 30.59, delay: 0.8 },
  { src: 'p6', left: 3.53, top: 49.77, width: 37.65, delay: 1.0 },
  { src: 'p7', left: 42.94, top: 56.28, width: 42.35, delay: 1.2 },
  { src: 'p8', left: 2.94, top: 74.42, width: 38.24, delay: 1.4 },
  { src: 'p9', left: 62.35, top: 73.02, width: 35.29, delay: 1.6 },
];

const Homepage = () => {
  const [viewportScale, setViewportScale] = useState(1);
  const { data: projects = [] } = useProjects();
  const { data: members = [] } = useCommunityMembers();
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateViewportScale = () => {
      const nextScale = window.visualViewport?.scale ?? 1;
      setViewportScale(nextScale);
    };

    updateViewportScale();

    const viewport = window.visualViewport;

    viewport?.addEventListener('resize', updateViewportScale);
    viewport?.addEventListener('scroll', updateViewportScale);
    window.addEventListener('resize', updateViewportScale);

    return () => {
      viewport?.removeEventListener('resize', updateViewportScale);
      viewport?.removeEventListener('scroll', updateViewportScale);
      window.removeEventListener('resize', updateViewportScale);
    };
  }, []);

  const sceneScale = useMemo(() => {
    if (viewportScale <= 1) return 1;

    const compensated = 1 / (1 + (viewportScale - 1) * 0.72);
    return Math.max(0.58, compensated);
  }, [viewportScale]);

  const sceneSize = useMemo(() => `${100 / sceneScale}%`, [sceneScale]);

  return (
    <main className="w-screen bg-background overflow-x-hidden">
      <Seo
        title="BuildC3 — Builders & Developers Community"
        path="/"
        exactTitle
        description="BuildC3 is a community of builders and developers. Build in the community, with the community, and for the community — explore projects, services, resources and meet the team."
      />

      {/* ── Hero section ── */}
      {isMobile ? (
        <section className="relative w-full bg-background pb-6 pt-24 text-center">
          <FlyingBadge />
          <h1 className="mt-5 px-6 font-hand text-[2.1rem] leading-[1.15] text-foreground">
            Build in with and for
            <br />
            the community.
          </h1>
          <span className="mx-auto mt-2 block h-[3px] w-24 rounded-full bg-[#f2b630]" />
          <p className="mt-5 px-6 text-[0.95rem] leading-relaxed text-muted-foreground">
            Real people. Real projects.
            <br />
            A growing community of builders.
          </p>
          <div className="relative mt-6 w-full" style={{ aspectRatio: '850 / 1075' }}>
            {MOBILE_PEEPS.map(({ src, left, top, width, delay }) => (
              <img
                key={src}
                src={`/mobile-hero/${src}.png`}
                alt=""
                aria-hidden="true"
                className="absolute h-auto opacity-0"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}%`,
                  animation: `peep-fade-in 0.6s ease-out ${delay}s forwards, peep-float 5s ease-in-out ${delay}s infinite`,
                }}
              />
            ))}
          </div>
          <SiteHeader position="overlay" hideLogo />
        </section>
      ) : (
        <section className="relative h-screen w-full">
          <h1 className="sr-only">BuildC3 — Builders &amp; Developers Community. Build in the community, with the community, and for the community.</h1>

          {/* Hero rounded box — inset on all sides */}
          <div className="absolute inset-6 rounded-[2rem] overflow-hidden">
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: sceneSize,
                height: sceneSize,
                transform: `translate(-50%, -50%) scale(${sceneScale})`,
                transformOrigin: 'center center',
                willChange: 'transform',
              }}
            >
              <Spline scene="https://prod.spline.design/0cyEg1aPz0Si15tV/scene.splinecode" />
            </div>
          </div>

          {/* Header overlaid on top of the hero box */}
          <SiteHeader position="overlay" />

        </section>
      )}

      {/* ── Cards section ── */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-6 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-5">

        {/* Left card — Community in Action / stats */}
        <div className="rounded-[1.75rem] border border-[#9F8064]/30 p-8 flex flex-col justify-between min-h-[280px]" style={{ background: 'linear-gradient(to top, #9B795D 0%, #BBAB8D 100%)' }}>
          {/* Top label */}
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              Our Community in Action
            </p>
            {/* Top-right image */}
            <img
              src="/left_card_sphere_image.png"
              alt=""
              className="w-32 h-32 object-contain -mt-2 -mr-2 opacity-90"
              draggable={false}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-end gap-10 mt-auto">
            <div>
              <p className="text-5xl font-bold text-white leading-none">
                {projects.length > 0 ? `${projects.length}+` : '15+'}
              </p>
              <p className="text-sm text-[#f5ede4]/80 font-medium mt-1">Projects Shipped</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white leading-none">40k+</p>
              <p className="text-sm text-[#f5ede4]/80 font-medium mt-1">Users</p>
            </div>
          </div>

          <a
            href="/projects"
            className="mt-6 self-start inline-flex items-center gap-2 rounded-full bg-white text-[#9F8064] text-sm font-semibold px-5 py-2.5 hover:bg-[#f5ede4] transition-colors"
          >
            Our Work →
          </a>
        </div>

        {/* Right card — What is BuildC3 */}
        <div className="rounded-[1.75rem] bg-background border border-[#9F8064]/25 p-8 flex flex-col justify-between min-h-[280px] shadow-[0_4px_24px_rgba(159,128,100,0.1)]">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              What is <span className="text-[#9F8064]">BuildC3</span>
            </h2>
            <div className="h-px bg-[#9F8064]/20 my-4" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              BuildC3 started with a simple frustration — too many great ideas never ship. Talented people with real product vision get stuck waiting for the right team, the right time, or the right resources.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our mission is to compress the time between idea and impact. We bring together builders, designers, and operators who are serious about shipping — and give them everything they need to go from 0 to live in two weeks.
            </p>
          </div>
          <a
            href="/about"
            className="mt-6 self-start inline-flex items-center gap-2 rounded-full bg-[#9F8064] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#8a6d54] transition-colors"
          >
            About community →
          </a>
        </div>

      </section>

      {/* ── Powered & Supported By section ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9F8064]">
          BuildC3 Powered and Supported By
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-20">
          {[
            {
              name: 'Netlify',
              href: 'https://www.netlify.com',
              logo: '/netlify.png',
            },
            {
              name: 'Spline',
              href: 'https://spline.design',
              logo: '/spline.png',
            },
            {
              name: 'Google',
              href: 'https://www.google.com',
              logo: '/google.png',
            },
          ].map(({ name, href, logo }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              title={name}
              className="flex items-center opacity-80 transition-all duration-300 hover:opacity-100 hover:-translate-y-0.5"
            >
              <img src={logo} alt={`${name} logo`} className="h-10 w-auto object-contain" draggable={false} />
            </a>
          ))}
        </div>
      </section>

    </main>
  );
};

export default Homepage;
