import { Linkedin, ExternalLink } from 'lucide-react';
import type { CommunityMember } from '@/types/database';

interface TeamCardProps {
  member: CommunityMember;
}

export function TeamCard({ member }: TeamCardProps) {
  return (
    <div className="group [perspective:1000px]">
      <div className="relative w-full aspect-[3/4] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* ── Front Face ── */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-white shadow-md [backface-visibility:hidden]">
          {/* Portrait image */}
          <img
            src={member.image_url}
            alt={member.name}
            className="h-full w-full object-cover"
          />

          {/* Name strip at the bottom */}
          <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-white/90 backdrop-blur-sm px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        {/* ── Back Face ── */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-white shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col">
          {/* 16:9 cover image */}
          <div className="w-full aspect-video overflow-hidden">
            <img
              src={member.cover_image_url}
              alt={`${member.name}'s work`}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Spacer pushes info to bottom */}
          <div className="flex-1" />

          {/* Name + portfolio link */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
            {member.portfolio_url && (
              <a
                href={member.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Portfolio
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
