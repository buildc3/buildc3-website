import { useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logo from '@/assets/buildc3-logo.png';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
];

interface SiteHeaderProps {
  /** Secret logo-click handler (5 rapid clicks → admin panel) */
  onLogoSecret?: () => void;
}

export function SiteHeader({ onLogoSecret }: SiteHeaderProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const clickTimestamps = useRef<number[]>([]);

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

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm w-full">
      <div className="flex items-center justify-between px-6 py-3 w-full">
        {/* Logo */}
        <button
          onClick={onLogoSecret ? handleLogoClick : () => navigate('/')}
          className="shrink-0 select-none"
          aria-label="Go to homepage"
        >
          <img src={logo} alt="BUILDC3" className="h-10 w-auto" />
        </button>

        {/* Nav */}
        <nav className="flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <a
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  active
                    ? 'text-primary font-semibold underline underline-offset-4 decoration-primary/50'
                    : 'text-foreground hover:text-primary'
                )}
              >
                {label}
              </a>
            );
          })}

          <a
            href="/join-buildc3"
            className={cn(
              'px-4 py-2 rounded-full font-semibold text-sm transition-colors shadow',
              isJoinActive
                ? 'bg-primary text-white ring-2 ring-primary/50 ring-offset-2'
                : 'bg-primary text-white hover:bg-primary/90'
            )}
          >
            Join BuildC3
          </a>
        </nav>
      </div>
    </header>
  );
}
