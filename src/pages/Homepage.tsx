import { useEffect, useMemo, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { SiteHeader } from '@/components/SiteHeader';

const Homepage = () => {
  const [viewportScale, setViewportScale] = useState(1);

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
    <main className="flex flex-col h-screen w-screen overflow-hidden">
      <SiteHeader />

      <div className="relative flex-1 overflow-hidden">
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

      {/* Footer overlay */}
      <footer className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-end px-6 py-2.5 bg-black/40 backdrop-blur-md border-t border-white/20">
        <a
          href="https://www.netlify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-white/30 bg-black/50 backdrop-blur-md px-4 py-1.5 text-white/90 hover:text-white hover:bg-black/60 hover:border-white/50 transition-all"
        >
          <img src="/images.png" alt="Netlify" className="h-4 w-4 rounded-full" />
          <span className="text-sm font-medium">Hosting by Netlify</span>
        </a>
      </footer>
    </main>
  );
};

export default Homepage;
