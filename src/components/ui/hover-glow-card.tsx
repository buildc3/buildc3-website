import { forwardRef, useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HoverGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional class names for the outer wrapper */
  className?: string;
  /** Additional class names for the inner card content area */
  contentClassName?: string;
  children: React.ReactNode;
}

/**
 * Premium card with ultra-smooth animated edge-traveling glow.
 *
 * Idle: clean dark card, zero glow, zero animation cost.
 * Hover / Touch / Focus: rotating conic-gradient light drifts along
 *   edges (8 s cycle) with subtle opacity breathing (0.65 ↔ 0.75).
 *   Wide 30 px blur creates an atmospheric glow; 2 px blur traces
 *   the border edge.
 * Mouse-leave / touch-end: glow fades out (300 ms), animation pauses.
 * Respects prefers-reduced-motion: static glow, no movement.
 */
const HoverGlowCard = forwardRef<HTMLDivElement, HoverGlowCardProps>(
  ({ className, contentClassName, children, ...props }, ref) => {
    // ── Touch support (mobile has no :hover) ────────────────────
    const [touched, setTouched] = useState(false);
    const touchTimer = useRef<ReturnType<typeof setTimeout>>();

    useEffect(
      () => () => {
        if (touchTimer.current) clearTimeout(touchTimer.current);
      },
      []
    );

    const onTouchStart = useCallback(() => {
      if (touchTimer.current) clearTimeout(touchTimer.current);
      setTouched(true);
    }, []);

    const onTouchEnd = useCallback(() => {
      touchTimer.current = setTimeout(() => setTouched(false), 350);
    }, []);

    // Shared active class tokens applied when touched on mobile
    const activeOpacityOuter = touched ? "!opacity-100" : undefined;
    const activeOpacityEdge = touched ? "!opacity-60" : undefined;
    const activePlayState = touched
      ? "![animation-play-state:running]"
      : undefined;
    const activeScale = touched ? "!scale-[1.01]" : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          "group relative rounded-[1.25rem] md:rounded-[1.5rem]",
          "will-change-transform",
          className
        )}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        {...props}
      >
        {/*
         * Outer blur glow — fade wrapper.
         * Wrapper controls show/hide via opacity transition.
         * Inner div runs the rotating + breathing animation.
         */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-[5px] rounded-[inherit]",
            "transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
            activeOpacityOuter
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-[inherit]",
              "blur-[30px]",
              "animate-edge-glow [animation-play-state:paused]",
              "group-hover:[animation-play-state:running]",
              "group-focus-within:[animation-play-state:running]",
              activePlayState
            )}
          />
        </div>

        {/*
         * Edge-line glow — fade wrapper.
         * Thin blur traces the border for a crisp accent.
         */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-[1.5px] rounded-[inherit]",
            "transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            "opacity-0 group-hover:opacity-60 group-focus-within:opacity-60",
            activeOpacityEdge
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-[inherit]",
              "blur-[2px]",
              "animate-edge-glow [animation-play-state:paused]",
              "group-hover:[animation-play-state:running]",
              "group-focus-within:[animation-play-state:running]",
              activePlayState
            )}
          />
        </div>

        {/* Card surface — sits above the glow layers */}
        <div
          className={cn(
            "relative flex flex-col overflow-hidden rounded-xl",
            "border-[0.75px] border-border/50 bg-background",
            "shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]",
            "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            "group-hover:scale-[1.01] group-focus-within:scale-[1.01]",
            activeScale,
            "motion-reduce:!transition-none motion-reduce:!transform-none",
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

HoverGlowCard.displayName = "HoverGlowCard";

export { HoverGlowCard };
export type { HoverGlowCardProps };
