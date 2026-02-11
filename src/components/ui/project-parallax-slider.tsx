import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Project } from "@/types/database";

interface ProjectParallaxSliderProps {
  projects: Project[];
  startIndex?: number;
}

const CONFIG = {
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.05,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 150,
  SNAP_DURATION: 500,
};

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

export function ProjectParallaxSlider({
  projects,
  startIndex = 0,
}: ProjectParallaxSliderProps) {
  const navigate = useNavigate();
  const [visibleRange, setVisibleRange] = React.useState({
    min: startIndex - CONFIG.BUFFER_SIZE,
    max: startIndex + CONFIG.BUFFER_SIZE,
  });
  const [activeIndex, setActiveIndex] = React.useState(startIndex);

  const getProjectData = React.useCallback(
    (index: number) => {
      if (projects.length === 0) return null;
      const i =
        ((index % projects.length) + projects.length) % projects.length;
      return projects[i];
    },
    [projects]
  );

  const getProjectNumber = React.useCallback(
    (index: number) => {
      if (projects.length === 0) return "00";
      const i =
        ((index % projects.length) + projects.length) % projects.length;
      return (i + 1).toString().padStart(2, "0");
    },
    [projects]
  );

  const state = React.useRef({
    currentY: -startIndex * (typeof window !== "undefined" ? window.innerHeight : 800),
    targetY: -startIndex * (typeof window !== "undefined" ? window.innerHeight : 800),
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0 },
    projectHeight: typeof window !== "undefined" ? window.innerHeight : 800,
    minimapHeight: 250,
  });

  const projectsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const minimapRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const infoRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const requestRef = React.useRef<number>();
  const renderedRange = React.useRef({
    min: startIndex - CONFIG.BUFFER_SIZE,
    max: startIndex + CONFIG.BUFFER_SIZE,
  });

  const updateParallax = (
    img: HTMLImageElement | null,
    scroll: number,
    index: number,
    height: number
  ) => {
    if (!img) return;
    if (!img.dataset.parallaxCurrent) {
      img.dataset.parallaxCurrent = "0";
    }
    let current = parseFloat(img.dataset.parallaxCurrent);
    const target = (-scroll - index * height) * 0.2;
    current = lerp(current, target, 0.1);
    if (Math.abs(current - target) > 0.01) {
      img.style.transform = `translateY(${current}px) scale(1.5)`;
      img.dataset.parallaxCurrent = current.toString();
    }
  };

  const updateSnap = () => {
    const s = state.current;
    const progress = Math.min(
      (Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION,
      1
    );
    const eased = 1 - Math.pow(1 - progress, 3);
    s.targetY = s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
    if (progress >= 1) s.isSnapping = false;
  };

  const snapToProject = () => {
    const s = state.current;
    const current = Math.round(-s.targetY / s.projectHeight);
    const target = -current * s.projectHeight;
    s.isSnapping = true;
    s.snapStart = {
      time: Date.now(),
      y: s.targetY,
      target: target,
    };
  };

  const updatePositions = () => {
    const s = state.current;
    const minimapY = (s.currentY * s.minimapHeight) / s.projectHeight;

    projectsRef.current.forEach((el, index) => {
      const y = index * s.projectHeight + s.currentY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      updateParallax(img, s.currentY, index, s.projectHeight);
    });

    minimapRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      if (img) {
        updateParallax(img, minimapY, index, s.minimapHeight);
      }
    });

    infoRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
    });
  };

  const animate = () => {
    const s = state.current;
    const now = Date.now();

    if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 100) {
      const snapPoint =
        -Math.round(-s.targetY / s.projectHeight) * s.projectHeight;
      if (Math.abs(s.targetY - snapPoint) > 1) snapToProject();
    }

    if (s.isSnapping) updateSnap();
    if (!s.isDragging) {
      s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR;
    }

    updatePositions();
  };

  const animationLoop = () => {
    animate();

    const s = state.current;
    const currentIndex = Math.round(-s.targetY / s.projectHeight);
    const min = currentIndex - CONFIG.BUFFER_SIZE;
    const max = currentIndex + CONFIG.BUFFER_SIZE;

    if (
      min !== renderedRange.current.min ||
      max !== renderedRange.current.max
    ) {
      renderedRange.current = { min, max };
      setVisibleRange({ min, max });
    }

    // Update active index for UI
    const newActive =
      ((currentIndex % projects.length) + projects.length) % projects.length;
    setActiveIndex(newActive);

    requestRef.current = requestAnimationFrame(animationLoop);
  };

  React.useEffect(() => {
    state.current.projectHeight = window.innerHeight;
    state.current.currentY = -startIndex * window.innerHeight;
    state.current.targetY = -startIndex * window.innerHeight;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = state.current;
      s.isSnapping = false;
      s.lastScrollTime = Date.now();
      const delta = Math.max(
        Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY),
        -CONFIG.MAX_VELOCITY
      );
      s.targetY -= delta;
    };

    const onTouchStart = (e: TouchEvent) => {
      const s = state.current;
      s.isDragging = true;
      s.isSnapping = false;
      s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY };
      s.lastScrollTime = Date.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      const s = state.current;
      if (!s.isDragging) return;
      s.targetY =
        s.dragStart.scrollY + (e.touches[0].clientY - s.dragStart.y) * 1.5;
      s.lastScrollTime = Date.now();
    };

    const onTouchEnd = () => {
      state.current.isDragging = false;
    };

    const onResize = () => {
      state.current.projectHeight = window.innerHeight;
      const container = document.querySelector(
        ".parallax-container"
      ) as HTMLElement;
      if (container) {
        container.style.height = `${window.innerHeight}px`;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    onResize();
    requestRef.current = requestAnimationFrame(animationLoop);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length, startIndex]);

  const indices = [];
  for (let i = visibleRange.min; i <= visibleRange.max; i++) {
    indices.push(i);
  }

  const activeProject = projects[activeIndex] ?? null;

  return (
    <div className="parallax-container">
      {/* Back Button Overlay */}
      <div className="parallax-overlay-top">
        <button
          onClick={() => navigate("/projects")}
          className="parallax-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        {activeProject?.external_link && (
          <a
            href={activeProject.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="parallax-visit-btn"
          >
            <span>Visit Project</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Active Project Title Overlay */}
      <div className="parallax-overlay-bottom">
        {activeProject && (
          <div className="parallax-active-info">
            <h1 className="parallax-active-title">{activeProject.title}</h1>
            {activeProject.description && (
              <p className="parallax-active-desc">{activeProject.description}</p>
            )}
            {activeProject.category && (
              <span className="parallax-active-badge">
                {activeProject.category.name}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Project Images */}
      <ul className="project-list">
        {indices.map((i) => {
          const data = getProjectData(i);
          if (!data) return null;
          return (
            <div
              key={i}
              className="project"
              ref={(el) => {
                if (el) projectsRef.current.set(i, el);
                else projectsRef.current.delete(i);
              }}
            >
              {data.thumbnail_url ? (
                <img src={data.thumbnail_url} alt={data.title} />
              ) : (
                <div className="project-placeholder">
                  <span>{data.title}</span>
                </div>
              )}
            </div>
          );
        })}
      </ul>

      {/* Minimap */}
      <div className="minimap">
        <div className="minimap-wrapper">
          <div className="minimap-img-preview">
            {indices.map((i) => {
              const data = getProjectData(i);
              if (!data) return null;
              return (
                <div
                  key={i}
                  className="minimap-img-item"
                  ref={(el) => {
                    if (el) minimapRef.current.set(i, el);
                    else minimapRef.current.delete(i);
                  }}
                >
                  {data.thumbnail_url ? (
                    <img src={data.thumbnail_url} alt={data.title} />
                  ) : (
                    <div className="minimap-placeholder" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="minimap-info-list">
            {indices.map((i) => {
              const data = getProjectData(i);
              if (!data) return null;
              const num = getProjectNumber(i);
              return (
                <div
                  key={i}
                  className="minimap-item-info"
                  ref={(el) => {
                    if (el) infoRef.current.set(i, el);
                    else infoRef.current.delete(i);
                  }}
                >
                  <div className="minimap-item-info-row">
                    <p>{num}</p>
                    <p>{data.title}</p>
                  </div>
                  <div className="minimap-item-info-row">
                    <p>{data.category?.name ?? ""}</p>
                    <p>
                      {new Date(data.created_at).getFullYear()}
                    </p>
                  </div>
                  {data.description && (
                    <div className="minimap-item-info-row">
                      <p>{data.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="parallax-scroll-hint">
        <div className="parallax-scroll-line" />
        <p>Scroll to explore</p>
      </div>
    </div>
  );
}
