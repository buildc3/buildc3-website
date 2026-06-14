import React, { useState } from 'react';
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  description?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Chadrack',
    role: 'director of photography',
    image: 'https://i.pravatar.cc/400?img=1',
    social: { twitter: '#', linkedin: '#', behance: '#' },
  },
  {
    id: '2',
    name: 'Mak VieSAinte',
    role: 'FOUNDER',
    image: '/Om.PNG',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '3',
    name: 'Osiris Balonga',
    role: 'LEAD FRONT-END',
    image: 'https://i.pravatar.cc/400?img=3',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '4',
    name: 'Jacques',
    role: 'PRODUCT OWNER',
    image: 'https://i.pravatar.cc/400?img=4',
    social: { linkedin: '#' },
  },
  {
    id: '5',
    name: 'Riche Makso',
    role: 'CTO - PRODUCT DESIGNER',
    image: 'https://i.pravatar.cc/400?img=5',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '6',
    name: 'Jemima',
    role: 'MAKE-UP ARTISTE',
    image: 'https://i.pravatar.cc/400?img=16',
    social: { instagram: '#' } as TeamMember['social'],
  },
];

interface TeamShowcaseProps {
  members?: TeamMember[];
  className?: string;
  heading?: string;
  description?: React.ReactNode;
}

export default function TeamShowcase({ members = DEFAULT_MEMBERS, className, heading, description }: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Center column holds a single member (the founder); the rest split evenly left/right.
  const centerIndex = Math.floor(members.length / 2);
  const col2 = members.filter((_, i) => i === centerIndex);
  const sideMembers = members.filter((_, i) => i !== centerIndex);
  const col1 = sideMembers.filter((_, i) => i % 2 === 0);
  const col3 = sideMembers.filter((_, i) => i % 2 === 1);

  const hoveredMember = hoveredId ? members.find(m => m.id === hoveredId) : null;

  return (
    <div className={cn("flex flex-col items-center justify-center select-none w-full max-w-5xl mx-auto py-8 px-4 md:px-6 font-sans", className)}>
      {/* ── Photo grid centered ── */}
      <div className="flex gap-2 md:gap-3 justify-center pb-8">
        {/* Column 1 */}
        <div className="flex flex-col gap-2 md:gap-3">
          {col1.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[110px] h-[120px] sm:w-[130px] sm:h-[140px] md:w-[155px] md:h-[165px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2 md:gap-3 mt-[48px] sm:mt-[56px] md:mt-[68px]">
          {col2.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[122px] h-[132px] sm:w-[145px] sm:h-[155px] md:w-[172px] md:h-[182px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-2 md:gap-3 mt-[22px] sm:mt-[26px] md:mt-[32px]">
          {col3.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="w-[115px] h-[125px] sm:w-[136px] sm:h-[146px] md:w-[162px] md:h-[172px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </div>

      {/* ── Center bottom: heading + description OR member info on hover ── */}
      <div className="text-center mt-4 h-[120px] md:h-[140px] relative">
        <div 
          key={hoveredMember?.id || 'default'}
          className="animate-text-reveal px-4"
        >
          {hoveredMember ? (
            <>
              <h3 
                className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-1 tracking-tight animate-slide-up"
                style={{ animationDelay: '0ms' }}
              >
                {hoveredMember.name}
              </h3>
              <p 
                className="text-[#9F8064] text-xs md:text-sm font-medium uppercase tracking-[0.2em] mb-3 animate-slide-up"
                style={{ animationDelay: '50ms' }}
              >
                {hoveredMember.role}
              </p>
              {hoveredMember.description && (
                <p 
                  className="text-white/60 text-sm md:text-base lg:text-lg font-normal leading-relaxed max-w-3xl mx-auto animate-slide-up"
                  style={{ animationDelay: '100ms' }}
                >
                  {hoveredMember.description}
                </p>
              )}
            </>
          ) : (heading || description) ? (
            <>
              {heading && (
                <h3 
                  className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-3 tracking-tight animate-slide-up"
                  style={{ animationDelay: '0ms' }}
                >
                  {heading}
                </h3>
              )}
              {description && (
                <p 
                  className="text-white/60 text-sm md:text-base lg:text-lg font-normal leading-relaxed max-w-3xl mx-auto animate-slide-up"
                  style={{ animationDelay: '50ms' }}
                >
                  {description}
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-text-reveal {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   Photo card 
───────────────────────────────────────── */

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl cursor-pointer flex-shrink-0 transition-opacity duration-400',
        className,
        isDimmed ? 'opacity-60' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-[filter] duration-500"
        style={{
          filter: isActive ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.77)',
          transform: member.name === 'Siddharth' ? 'scale(1.25)' : undefined,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Member name section
───────────────────────────────────────── */

function MemberRow({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  const hasSocial = member.social?.twitter ?? member.social?.linkedin ?? member.social?.instagram ?? member.social?.behance;

  return (
    <div
      className={cn(
        'cursor-pointer transition-opacity duration-300',
        isDimmed ? 'opacity-50' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Name + social*/}
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'w-4 h-3 rounded-[5px] flex-shrink-0 transition-all duration-300',
            isActive ? 'bg-white w-5' : 'bg-white/25',
          )}
        />
        <span
          className={cn(
            'text-base md:text-[18px] font-semibold leading-none tracking-tight transition-colors duration-300',
            isActive ? 'text-white' : 'text-white/80',
          )}
        >
          {member.name}
        </span>

        {/* Social icons */}
        {hasSocial && (
          <div
            className={cn(
              'flex items-center gap-1.5 ml-0.5 transition-all duration-200',
              isActive
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-2 pointer-events-none',
            )}
          >
            {member.social?.twitter && (
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110"
                title="X / Twitter"
              >
                <FaTwitter size={10} />
              </a>
            )}
            {member.social?.linkedin && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110"
                title="LinkedIn"
              >
                <FaLinkedinIn size={10} />
              </a>
            )}
            {member.social?.instagram && (
              <a
                href={member.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110"
                title="Instagram"
              >
                <FaInstagram size={10} />
              </a>
            )}
            {member.social?.behance && (
              <a
                href={member.social.behance}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110"
                title="Behance"
              >
                <FaBehance size={10} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Role */}
      <p className="mt-1.5 pl-[27px] text-[7px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
        {member.role}
      </p>
    </div>
  );
}
