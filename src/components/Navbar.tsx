import { useState, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import logo from '@/assets/buildc3-logo.png';

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSecretTrigger: () => void;
}

export function Navbar({ search, onSearchChange, onSecretTrigger }: NavbarProps) {
  const clickTimestamps = useRef<number[]>([]);

  const handleLogoClick = useCallback(() => {
    const now = Date.now();
    clickTimestamps.current.push(now);
    // Keep only clicks within last 2 seconds
    clickTimestamps.current = clickTimestamps.current.filter(t => now - t < 2000);
    if (clickTimestamps.current.length >= 5) {
      clickTimestamps.current = [];
      onSecretTrigger();
    }
  }, [onSecretTrigger]);

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-sm">
      <div className="mx-auto flex items-center gap-4 px-4 py-3 max-w-7xl">
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={handleLogoClick} className="shrink-0 select-none">
            <img src={logo} alt="BUILDC3" className="h-10 w-auto" />
          </button>
          <span className="text-sm font-semibold text-foreground hidden sm:block">
            BUILDC3 : in, with and for the community
          </span>
        </div>

        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search projects..."
            className="pl-10 rounded-full bg-secondary border-none focus-visible:ring-primary"
          />
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <a
            href="#lets-talk"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Let's Talk
          </a>
          <a
            href="#meet-the-community"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Meet the Community
          </a>
          <a
            href="#about-the-community"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            About the Community
          </a>
        </div>
      </div>
    </nav>
  );
}
