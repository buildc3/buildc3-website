import { useEffect, useMemo, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { SiteHeader } from '@/components/SiteHeader';
import { Seo } from '@/components/Seo';
import { useProjects } from '@/hooks/useProjects';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';

const Homepage = () => {
  const [viewportScale, setViewportScale] = useState(1);
  const { data: projects = [] } = useProjects();
  const { data: members = [] } = useCommunityMembers();

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
      <section className="relative h-screen w-full">

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
