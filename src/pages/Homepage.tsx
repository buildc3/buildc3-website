import Spline from '@splinetool/react-spline';
import logo from '@/assets/buildc3-logo.png';

const Homepage = () => {
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
            href="#meet-the-community"
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

      <Spline scene="https://prod.spline.design/0cyEg1aPz0Si15tV/scene.splinecode" />

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
