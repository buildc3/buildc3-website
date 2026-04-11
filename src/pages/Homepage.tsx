import { useEffect, useMemo, useState } from 'react';
import Spline from '@splinetool/react-spline';
import logo from '@/assets/buildc3-logo.png';

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
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Header overlay above the Spline scene */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-black/40 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-3">
          <img src={logo} alt="BUILDC3" className="h-9 w-auto" />
        </div>

        <nav className="flex items-center gap-7">
          <a
            href="#lets-talk"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            Let's Talk
          </a>
          <a
            href="/community"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            Meet the Community
          </a>
          <a
            href="#about-the-community"
            className="text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            About the Community
          </a>
        </nav>
      </header>

      <div className="absolute inset-0 overflow-hidden">
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
