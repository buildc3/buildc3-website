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
    <nav className="sticky top-0 z-50 w-full px-4 pt-4">
      <div className="mx-auto flex max-w-6xl items-center gap-4 rounded-2xl border border-white/50 bg-[#d7d7d7]/80 px-6 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.2)] backdrop-blur-md">
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
            className="pl-10 rounded-full bg-white/90 border border-white/70 focus-visible:ring-[#5c79ff]"
          />
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <a
            href="#about"
            className="text-sm font-medium text-slate-700/90 hover:text-slate-900 transition-colors"
          >
            About
          </a>
          <button
            onClick={() => window.location.href = '/join-buildc3'}
            className="px-4 py-2 rounded-full bg-[#5c79ff] text-white font-semibold hover:bg-[#4d6bff] transition-colors shadow-[0_8px_18px_rgba(58,90,255,0.35)]"
          >
            Join BuildC3
          </button>
        </div>
      </div>
    </nav>
  );
}
