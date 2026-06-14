// src/components/ui/cinematic-landing-hero.tsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import TeamShowcase, { type TeamMember } from "./team-showcase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, color-mix(in srgb, hsl(var(--foreground)) 5%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, hsl(var(--foreground)) 5%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* OUTSIDE THE CARD: Theme-aware text */
  .text-3d-matte {
      color: hsl(var(--foreground));
      text-shadow:
          0 10px 30px color-mix(in srgb, hsl(var(--foreground)) 20%, transparent),
          0 2px 4px color-mix(in srgb, hsl(var(--foreground)) 10%, transparent);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, hsl(var(--foreground)) 0%, color-mix(in srgb, hsl(var(--foreground)) 40%, transparent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter:
          drop-shadow(0px 10px 20px color-mix(in srgb, hsl(var(--foreground)) 15%, transparent))
          drop-shadow(0px 2px 4px color-mix(in srgb, hsl(var(--foreground)) 10%, transparent));
  }

  /* INSIDE THE CARD: Light text for the dark background */
  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.65) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 4px 12px rgba(255,255,255,0.15)) 
          drop-shadow(0px 2px 4px rgba(255,255,255,0.08));
  }

  /* Deep Physical Card with Dynamic Mouse Lighting */
  .premium-depth-card {
      background: linear-gradient(145deg, #1c1c1e 0%, #080808 100%);
      box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 0.8),
          0 20px 40px -20px rgba(0, 0, 0, 0.6),
          inset 0 1px 3px rgba(255, 255, 255, 0.12),
          inset 0 -2px 6px rgba(0, 0, 0, 0.9),
          inset 0 0 80px rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.3) 0%, transparent 40%);
      mix-blend-mode: overlay; transition: opacity 0.3s ease;
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow: 
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }

  /* Physical Tactile Buttons */
  .btn-modern-light, .btn-modern-dark {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
      color: #0F172A;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #27272A 0%, #18181B 100%);
      color: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:hover {
      transform: translateY(-3px);
      background: linear-gradient(180deg, #3F3F46 0%, #27272A 100%);
  }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }

  /* Clockwork segments */
  .clockwork-segment {
      transition: opacity 0.3s ease, stroke-dashoffset 0.5s ease;
  }
`;

const SEGMENT_COLORS = [
  "#E8573A", "#F2A93B", "#4ECDC4", "#556FB5", "#C44DFF", "#0065F4", "#22C55E",
];

const CLOCKWORK_RADIUS = 260;
const SEGMENT_COUNT = 7;

interface Segment {
  color: string;
  width: number;
  offset: number;
  strokeW: number;
}

function generateSegments(radius: number, count: number): Segment[] {
  const circumference = 2 * Math.PI * radius;
  const gapSize = 6;
  const totalGap = count * gapSize;
  const usable = circumference - totalGap;
  const segmentWidth = usable / count;

  const segments: Segment[] = [];
  let offset = 0;
  for (let i = 0; i < count; i++) {
    segments.push({
      color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
      width: segmentWidth,
      offset,
      strokeW: 4,
    });
    offset += segmentWidth + gapSize;
  }
  return segments;
}

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButtons?: React.ReactNode;
  deviceType?: 'phone' | 'laptop' | 'clockwork' | 'teamShowcase';
  logoSrc?: string;
  heroDescription?: string;
  visionHeading?: string;
  visionContent?: React.ReactNode;
  timelineSteps?: Array<{ title: string; description?: string; icon?: string }>;
  clockworkImage?: string;
  clockworkVideo?: string;
  teamMembers?: TeamMember[];
}

export function CinematicHero({ 
  brandName = "BuildC3",
  tagline1 = "Built by builders,",
  tagline2 = "for builders.",
  cardHeading = "What we do",
  cardDescription = <><span className="text-white font-semibold">BuildC3</span> brings together builders, designers, and operators who are serious about shipping — and we give them everything they need to go from 0 to live in two weeks.</>,
  metricValue = 40,
  metricLabel = "Projects",
  ctaHeading = "Join the community.",
  ctaDescription = "Be part of a community that doesn't just talk about building — we actually build together.",
  ctaButtons,
  deviceType = 'clockwork',
  logoSrc,
  heroDescription,
  visionHeading = "Our Vision",
  visionContent,
  timelineSteps,
  clockworkImage = "/buildc3-logo.png",
  clockworkVideo,
  teamMembers,
  className, 
  ...props 
}: CinematicHeroProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const segmentRefs = useRef<(SVGCircleElement | null)[]>([]);
  const timelineTextsRef = useRef<(HTMLDivElement | null)[]>([]);
  const clockworkIntroRef = useRef<HTMLDivElement>(null);
  
  const effectiveSegmentCount = (deviceType === 'clockwork' && timelineSteps && timelineSteps.length > 0)
    ? timelineSteps.length
    : SEGMENT_COUNT;
  const clockworkSegments = generateSegments(CLOCKWORK_RADIUS, effectiveSegmentCount);
  const clockworkCircumference = 2 * Math.PI * CLOCKWORK_RADIUS;

  // Mouse Interaction Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;

      cancelAnimationFrame(requestRef.current);
      
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  },[]);

  // Cinematic Scroll Timeline
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set(".hero-logo", { autoAlpha: 0, y: -40, scale: 0.8 });
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".hero-description", { autoAlpha: 0, y: 40, filter: "blur(10px)" });
      gsap.set(".scroll-indicator", { autoAlpha: 0 });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });
      gsap.set(".vision-overlay", { autoAlpha: 0, y: 30 });

      // Initialize clockwork segments
      clockworkSegments.forEach((seg, i) => {
        const el = segmentRefs.current[i];
        if (el) {
          el.style.strokeDasharray = `${seg.width} ${clockworkCircumference - seg.width}`;
          el.style.strokeDashoffset = `${clockworkCircumference - seg.offset + seg.width}`;
          gsap.set(el, { opacity: 0 });
        }
      });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".hero-logo", { duration: 1.2, autoAlpha: 1, y: 0, scale: 1, ease: "expo.out" })
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" }, "-=0.6")
        .to(".text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0")
        .to(".hero-description", { duration: 1.2, autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "power3.out" }, "-=0.8")
        .to(".scroll-indicator", { duration: 1, autoAlpha: 1, ease: "power2.out" }, "-=0.6");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=10000",
          pin: true,
          scrub: 2,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to(".scroll-indicator", { autoAlpha: 0, y: 20, ease: "power2.in", duration: 0.5 }, 0)
        .fromTo([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1, filter: "blur(0px)", opacity: 1 }, { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2, immediateRender: false }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".vision-overlay", { autoAlpha: 1, y: 0, ease: "power3.out", duration: 1.2 }, 0.6)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .to({}, { duration: 1.5 })
        .to(".vision-overlay", { autoAlpha: 0, y: -30, ease: "power2.in", duration: 1 })
        .fromTo(".mockup-scroll-wrapper",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.4"
        )
        .fromTo(".card-left-text",
          { x: -60, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, ease: "expo.out", duration: 2 }, "-=2"
        )
        .fromTo(".phone-widget", { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
        .to(".progress-ring", { strokeDashoffset: 60, duration: 2, ease: "power3.inOut" }, "-=1.2")
        .to(".counter-val", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 2, ease: "expo.out" }, "-=2.0");
      
      const isClockwork = deviceType === 'clockwork';
      const steps = timelineSteps && timelineSteps.length > 0 ? timelineSteps : [];

      if (isClockwork && steps.length > 0) {
        gsap.set(clockworkIntroRef.current, { opacity: 1, y: 0 });
        steps.forEach((_, i) => {
          const text = timelineTextsRef.current[i];
          if (text) gsap.set(text, { opacity: 0, y: 40 });
        });
      }

      scrollTl.addLabel("clockworkStart");

      clockworkSegments.forEach((seg, i) => {
        const el = segmentRefs.current[i];
        if (el) {
          const pos = `clockworkStart+=${i * 1.5}`;
          scrollTl.to(el, { opacity: 1, duration: 0.3, ease: "power2.out" }, pos);
          scrollTl.to(el, {
            strokeDashoffset: `${clockworkCircumference - seg.offset}`,
            duration: 0.5,
            ease: "power2.out",
          }, pos);
        }
      });

      if (isClockwork && steps.length > 0) {
        steps.forEach((_, i) => {
          const text = timelineTextsRef.current[i];
          if (!text) return;
          if (i === 0) {
            scrollTl.to(clockworkIntroRef.current, { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" }, `clockworkStart+=0`);
            scrollTl.to(text, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, `clockworkStart+=0.2`);
          } else {
            scrollTl.to(text, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, `clockworkStart+=${i * 1.5 - 0.35}`);
          }
          if (i < steps.length - 1) {
            scrollTl.to(text, { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" }, `clockworkStart+=${i * 1.5 + 0.6}`);
          }
        });
      }

      scrollTl
        .fromTo(".floating-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=1.0")
        .fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "-=1.5")
        .to({}, { duration: 2.5 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 }) 
        .to({}, { duration: 1.5 })
        .to([".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05,
        })
        .to(".main-card", { 
          width: isMobile ? "92vw" : "85vw", 
          height: isMobile ? "92vh" : "85vh", 
          borderRadius: isMobile ? "32px" : "40px", 
          ease: "expo.inOut", 
          duration: 1.8 
        }, "pullback") 
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

    }, containerRef);

    return () => ctx.revert();
  },[metricValue, clockworkSegments, clockworkCircumference, deviceType, timelineSteps]); 

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-background text-foreground font-sans antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true" />

      {/* BACKGROUND LAYER: Hero Texts */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform transform-style-3d">
        {logoSrc && (
          <div className="hero-logo gsap-reveal mb-4">
            <img 
              src={logoSrc}
              alt="Logo"
              className="h-16 md:h-20 lg:h-24 w-auto drop-shadow-2xl"
            />
          </div>
        )}
        <h1 className="text-track gsap-reveal text-3d-matte text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2">
          {tagline1}
        </h1>
        <h1 className="text-days text-3xl md:text-5xl lg:text-[4rem] font-extrabold tracking-tighter text-foreground" style={{ willChange: 'clip-path' }}>
          {tagline2}
        </h1>
        {heroDescription && (
          <p className="hero-description gsap-reveal mt-8 text-sm md:text-base lg:text-lg text-foreground/80 max-w-4xl leading-relaxed px-4 font-normal">
            {heroDescription}
          </p>
        )}
      </div>

      {/* Scroll Down Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-muted-foreground/70 uppercase tracking-widest font-medium">Scroll</span>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-muted-foreground/70"
        >
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>

      {/* BACKGROUND LAYER 2: CTA Buttons */}
      <div className="cta-wrapper absolute inset-0 z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-foreground">
          {ctaHeading}
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>
        {ctaButtons ? ctaButtons : (
          <div className="flex flex-col sm:flex-row gap-6">
            <a href="/join-buildc3" className="btn-modern-light flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] group focus:outline-none">
              <div className="text-left">
                <div className="text-xl font-bold leading-none tracking-tight">Join BuildC3</div>
              </div>
            </a>
            <a href="/projects" className="btn-modern-dark flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] group focus:outline-none">
              <div className="text-left">
                <div className="text-xl font-bold leading-none tracking-tight">View Projects</div>
              </div>
            </a>
          </div>
        )}
      </div>

      {/* FOREGROUND LAYER: The Physical Deep Card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          {/* OUR VISION — shown while the card slides up, before the full zoom-in reveals the content */}
          <div className="vision-overlay absolute inset-0 z-30 pointer-events-none">
            {/* Hands image as the centerpiece */}
            <img
              src="/hands.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain object-center opacity-90 p-12 md:p-20"
            />

            {visionContent ? (
              <>
                {/* Top-left: OUR VISION title */}
                <h2
                  className="absolute top-[18%] left-[12%] md:left-[18%] text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-[40%]"
                  style={{ color: '#9F8064' }}
                >
                  {visionHeading}
                </h2>
                {/* Bottom-right: custom vision text */}
                <div className="absolute bottom-[16%] right-[10%] md:right-[14%] text-white/80 text-xs md:text-base lg:text-lg leading-relaxed max-w-[38%] font-light space-y-3 text-right">
                  {visionContent}
                </div>
              </>
            ) : (
              <>
                {/* Top-left: OUR VISION title + intro line */}
                <div className="absolute top-[16%] left-[10%] md:left-[14%] max-w-[42%]">
                  <h2
                    className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
                    style={{ color: '#9F8064' }}
                  >
                    {visionHeading}
                  </h2>
                  <p className="text-white/80 text-xs md:text-base lg:text-lg leading-relaxed font-light max-w-[75%]">
                    We aim to make a community of <span className="font-semibold" style={{ color: '#9F8064' }}>Builders</span> that believe in a <span className="font-semibold" style={{ color: '#9F8064' }}>fast-paced delivery</span>, solving <span className="font-semibold" style={{ color: '#9F8064' }}>real-world projects</span>.
                  </p>
                </div>

                {/* Bottom-right: rest of the vision text */}
                <div className="absolute bottom-[16%] right-[10%] md:right-[14%] text-white/80 text-xs md:text-base lg:text-lg leading-relaxed max-w-[38%] font-light space-y-3 text-right">
                  <p>
                    For our projects we believe in solving problems that we ourselves face, because we believe that one person isn't so unique that if he is facing the issue 100 other people won't be — just that no one actually takes the <span className="font-semibold" style={{ color: '#9F8064' }}>initiative</span>, but we do take the initiative.
                  </p>
                  <p className="font-semibold" style={{ color: '#9F8064' }}>
                    Solving the problem for the world!
                  </p>
                </div>
              </>
            )}
          </div>

          {/* DYNAMIC RESPONSIVE GRID */}
          <div className={cn(
            "relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col items-center z-10 py-6 lg:py-0",
            deviceType === 'teamShowcase' ? "justify-center" : "justify-evenly lg:grid lg:grid-cols-2 lg:gap-8"
          )}>

            {/* DEVICE MOCKUP */}
            <div className={cn(
              "mockup-scroll-wrapper relative w-full flex items-center justify-center z-10",
              deviceType === 'teamShowcase' ? "h-auto" : "order-2 lg:order-2 h-[420px] lg:h-[680px]"
            )} style={{ perspective: "1000px" }}>
              <div className={cn(
                "relative w-full h-full flex items-center justify-center",
                deviceType === 'teamShowcase' ? "" : "transform scale-[0.65] md:scale-85 lg:scale-100"
              )}>
                
                {deviceType === 'teamShowcase' ? (
                  /* Team Showcase */
                  <div
                    ref={mockupRef}
                    className="relative will-change-transform transform-style-3d w-full h-full flex items-center justify-center"
                  >
                    <TeamShowcase members={teamMembers} heading={cardHeading} description={cardDescription} />
                  </div>
                ) : deviceType === 'clockwork' ? (
                  /* Clockwork Animation */
                  <div
                    ref={mockupRef}
                    className="relative will-change-transform transform-style-3d"
                    style={{ width: '780px', height: '780px' }}
                  >
                    {/* Clockwork Ring SVG */}
                    <svg
                      width="780"
                      height="780"
                      viewBox="0 0 560 560"
                      className="absolute z-20 pointer-events-none"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(-90deg)",
                      }}
                    >
                      {/* Base track */}
                      <circle
                        cx="280" cy="280" r={CLOCKWORK_RADIUS}
                        fill="none"
                        stroke="hsla(0, 0%, 100%, 0.06)"
                        strokeWidth="2"
                      />
                      {/* Glowing segments */}
                      {clockworkSegments.map((seg, i) => (
                        <circle
                          key={i}
                          ref={(el) => { segmentRefs.current[i] = el; }}
                          cx="280" cy="280" r={CLOCKWORK_RADIUS}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth={seg.strokeW}
                          strokeLinecap="round"
                          className="clockwork-segment"
                          style={{
                            filter: `drop-shadow(0 0 8px ${seg.color}) drop-shadow(0 0 20px ${seg.color}66) drop-shadow(0 0 40px ${seg.color}33)`,
                          }}
                        />
                      ))}
                    </svg>

                    {/* Center image/video circle */}
                    <div
                      className="absolute rounded-full overflow-hidden flex items-center justify-center"
                      style={{
                        width: "640px",
                        height: "640px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        filter: "drop-shadow(0 0 40px rgba(51, 85, 255, 0.5)) drop-shadow(0 0 80px rgba(51, 85, 255, 0.25))",
                      }}
                    >
                      {clockworkVideo ? (
                        <video
                          src={clockworkVideo}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={clockworkImage}
                          alt="Center"
                          className="object-contain drop-shadow-2xl w-48 h-48"
                        />
                      )}
                    </div>

                    {/* Ambient glow */}
                    <div
                      className="absolute rounded-full pointer-events-none -z-10"
                      style={{
                        width: "720px",
                        height: "720px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background:
                          "radial-gradient(circle, hsla(32, 95%, 55%, 0.12) 0%, hsla(170, 60%, 50%, 0.06) 40%, transparent 70%)",
                        filter: "blur(40px)",
                      }}
                    />
                  </div>
                ) : (
                  /* Fallback: Simple centered metric display */
                  <div
                    ref={mockupRef}
                    className="relative w-64 h-64 flex items-center justify-center will-change-transform"
                  >
                    <div className="phone-widget relative w-44 h-44 mx-auto flex items-center justify-center drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                        <circle cx="88" cy="88" r="64" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                        <circle className="progress-ring" cx="88" cy="88" r="64" fill="none" stroke="#3B82F6" strokeWidth="12" />
                      </svg>
                      <div className="text-center z-10 flex flex-col items-center">
                        <span className="counter-val text-4xl font-extrabold tracking-tighter text-white">0</span>
                        <span className="text-[8px] text-blue-200/50 uppercase tracking-[0.1em] font-bold mt-0.5">{metricLabel}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Glass Badges - hidden for teamShowcase */}
                {deviceType !== 'teamShowcase' && (
                  <>
                    <div className="floating-badge absolute flex top-6 lg:top-12 left-[-15px] lg:left-[-80px] rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30 bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-[#9F8064]/20 to-[#9F8064]/10 flex items-center justify-center border border-[#9F8064]/30 shadow-inner">
                        <span className="text-base lg:text-xl drop-shadow-lg" aria-hidden="true">🚀</span>
                      </div>
                      <div>
                        <p className="text-[#9F8064] text-xs lg:text-sm font-bold tracking-tight">Ship in 2 Weeks</p>
                        <p className="text-[#9F8064]/50 text-[10px] lg:text-xs font-medium">Idea to live</p>
                      </div>
                    </div>

                    <div className="floating-badge absolute flex bottom-12 lg:bottom-20 right-[-15px] lg:right-[-80px] rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30 bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-[#9F8064]/20 to-[#9F8064]/10 flex items-center justify-center border border-[#9F8064]/30 shadow-inner">
                        <span className="text-base lg:text-lg drop-shadow-lg" aria-hidden="true">🤝</span>
                      </div>
                      <div>
                        <p className="text-[#9F8064] text-xs lg:text-sm font-bold tracking-tight">Real Mentors</p>
                        <p className="text-[#9F8064]/50 text-[10px] lg:text-xs font-medium">Who've done it</p>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* LEFT TEXT */}
            {deviceType === 'teamShowcase' ? null : deviceType === 'clockwork' && timelineSteps && timelineSteps.length > 0 ? (
              <div className="card-left-text order-3 lg:order-1 relative z-20 w-full lg:max-w-none px-4 lg:px-0 lg:-ml-16 min-h-[300px] lg:h-[420px]">
                {/* Intro: logo + label */}
                <div
                  ref={clockworkIntroRef}
                  className="absolute inset-0 flex flex-col justify-center text-left"
                  style={{ opacity: 0 }}
                >
                  {logoSrc && (
                    <img src={logoSrc} alt="Logo" className="h-16 lg:h-20 w-auto mb-5 mr-auto" />
                  )}
                  <span className="text-sm font-mono uppercase tracking-[0.3em] text-white/40 mb-2">Discover</span>
                  <h3 className="text-white text-4xl lg:text-6xl font-black tracking-tight">What We Offer</h3>
                </div>
                {/* Individual feature texts */}
                {timelineSteps.map((step, i) => (
                  <div
                    key={i}
                    ref={(el) => { timelineTextsRef.current[i] = el; }}
                    className="absolute inset-0 flex flex-col justify-center text-left"
                    style={{ opacity: 0 }}
                  >
                    <span className="text-sm font-mono uppercase tracking-[0.3em] text-white/40 mb-3">
                      {String(i + 1).padStart(2, '0')} / {String(timelineSteps.length).padStart(2, '0')}
                    </span>
                    <h3 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-md">
                        {step.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-none px-4 lg:px-0 lg:-ml-16">
                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                  {cardHeading}
                </h3>
                <p className="hidden md:block text-white/60 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                  {cardDescription}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
