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
 * Premium card with ultra-thin animated edge light on hover.
 *
 * Idle: clean dark card, zero glow, zero animation cost.
 * Hover / Touch / Focus: rotating conic-gradient traces a thin
 *   hair-line of light along the card border (8s cycle).
 *   Subtle outer glow (4px blur) adds atmosphere without bulk.
 * Mouse-leave / touch-end: fades out (300ms), animation pauses.
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
    const activeOpacityGlow = touched ? "!opacity-40" : undefined;
    const activeOpacityEdge = touched ? "!opacity-50" : undefined;
    const activePlayState = touched
      ? "![animation-play-state:running]"
      : undefined;
    const activeScale = touched ? "!scale-[1.008]" : undefined;

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
         * Soft outer glow — very subtle atmosphere bleed.
         * Low opacity + small blur = thin halo, not a fat border.
         */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-[2px] rounded-[inherit]",
            "transition-opacity duration-300 ease-in-out",
            "opacity-0 group-hover:opacity-40 group-focus-within:opacity-40",
            activeOpacityGlow
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-[inherit]",
              "blur-[4px]",
              "animate-edge-glow [animation-play-state:paused]",
              "group-hover:[animation-play-state:running]",
              "group-focus-within:[animation-play-state:running]",
              activePlayState
            )}
          />
        </div>

        {/*
         * Thin edge-line — the primary visible element.
         * Hair-thin 1px blur traces the card border.
         */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-[0.5px] rounded-[inherit]",
            "transition-opacity duration-300 ease-in-out",
            "opacity-0 group-hover:opacity-50 group-focus-within:opacity-50",
            activeOpacityEdge
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-[inherit]",
              "blur-[1px]",
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
            "transition-transform duration-300 ease-in-out",
            "group-hover:scale-[1.008] group-focus-within:scale-[1.008]",
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
