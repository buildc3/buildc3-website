import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logo from '@/assets/buildc3-logo.png';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Our Work', href: '/projects' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact Us', href: '/contact' },
];

interface SiteHeaderProps {
  /** Secret logo-click handler (5 rapid clicks → admin panel) */
  onLogoSecret?: () => void;
  position?: 'sticky' | 'overlay';
}

export function SiteHeader({ onLogoSecret, position = 'sticky' }: SiteHeaderProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const clickTimestamps = useRef<number[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = useCallback(() => {
    if (onLogoSecret) {
      const now = Date.now();
      clickTimestamps.current.push(now);
      clickTimestamps.current = clickTimestamps.current.filter(t => now - t < 2000);
      if (clickTimestamps.current.length >= 5) {
        clickTimestamps.current = [];
        onLogoSecret();
      }
    }
  }, [onLogoSecret]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  const isJoinActive = pathname === '/join-buildc3';

  const headerPositionClass =
    position === 'overlay' ? 'fixed top-0 left-0' : 'sticky top-0';

  return (
    <>
      <header className={cn(headerPositionClass, 'z-[100] w-full px-4 pt-4')}>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 md:grid-cols-3 items-center gap-4 rounded-2xl bg-[#d7d7d7]/80 px-4 md:px-6 py-3 shadow-[0_8px_28px_rgba(60,35,15,0.18)] backdrop-blur-md">
          {/* Logo */}
          <button
            onClick={onLogoSecret ? handleLogoClick : () => navigate('/')}
            className="shrink-0 select-none justify-self-start"
            aria-label="Go to homepage"
          >
            <img src={logo} alt="BUILDC3" className="h-10 w-auto" />
          </button>

          {/* Nav links — centered (hidden on mobile) */}
          <nav className="hidden md:flex items-center justify-center gap-4 lg:gap-6">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <a
                  key={href}
                  href={href}
                  className={cn(
                    'text-sm font-medium transition-colors whitespace-nowrap',
                    active
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-700/90 hover:text-slate-900'
                  )}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Right side: Join button (desktop) + Hamburger (mobile) */}
          <div className="flex items-center justify-end gap-3">
            {/* Join button — hidden on mobile */}
            <a
              href="/join-buildc3"
              className={cn(
                'hidden md:inline-flex px-4 py-2 rounded-full font-semibold text-sm transition-colors text-white shadow-[0_8px_18px_rgba(58,90,255,0.35)]',
                isJoinActive
                  ? 'bg-[#5c79ff] ring-2 ring-white/70 ring-offset-2 ring-offset-transparent'
                  : 'bg-[#5c79ff] hover:bg-[#4d6bff]'
              )}
            >
              Join BuildC3
            </a>

            {/* Hamburger menu button — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-200/50 transition-colors"
              aria-label="Toggle menu"
            >
              <span className={cn(
                "w-5 h-0.5 bg-slate-700 rounded-full transition-all duration-300",
                mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              )} />
              <span className={cn(
                "w-5 h-0.5 bg-slate-700 rounded-full my-1 transition-all duration-300",
                mobileMenuOpen ? "opacity-0" : ""
              )} />
              <span className={cn(
                "w-5 h-0.5 bg-slate-700 rounded-full transition-all duration-300",
                mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              )} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu popover — portaled to body so ancestor transforms/perspective
          (e.g. the CinematicHero's `perspective` + GSAP pin on About) can't trap
          the fixed overlay and blank the screen. */}
      {mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[9999] md:hidden pointer-events-auto">
          {/* Backdrop - click to close */}
          <div 
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu panel - 70% width, aligned right */}
          <div 
            className="absolute top-20 right-4 w-[70%] bg-white rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map(({ label, href }) => {
                const active = isActive(href);
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-xl text-base font-medium transition-colors',
                      active
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    {label}
                  </a>
                );
              })}
              
              {/* Join button in mobile menu */}
              <a
                href="/join-buildc3"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'mt-2 px-4 py-3 rounded-xl font-semibold text-base text-center transition-colors text-white shadow-[0_8px_18px_rgba(58,90,255,0.35)]',
                  isJoinActive
                    ? 'bg-[#5c79ff] ring-2 ring-white/70'
                    : 'bg-[#5c79ff] hover:bg-[#4d6bff]'
                )}
              >
                Join BuildC3
              </a>
            </nav>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
