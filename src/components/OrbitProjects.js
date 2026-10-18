import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "motion/react";
import "./OrbitProjects.css";

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(Math.max(value, minimum), maximum);
}

function lerp(from, to, progress) {
  return from + (to - from) * progress;
}

function smootherstep(start, end, value) {
  if (start === end) return value < start ? 0 : 1;
  const progress = clamp((value - start) / (end - start));
  return progress * progress * progress * (progress * (progress * 6 - 15) + 10);
}

function CardFace({ item, radius }) {
  return (
    <div className="orbit-card-face" style={{ borderRadius: radius }}>
      <img src={item.image} alt="" draggable={false} />
      <span className="orbit-card-label">
        {item.label}
        {item.description ? <small>{item.description}</small> : null}
      </span>
    </div>
  );
}

export function OrbitProjects({ items }) {
  const reduceMotion = !!useReducedMotion();
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const targetProgress = useRef(0);
  const animatedProgress = useRef(0);
  const rafRef = useRef(null);
  const lastTime = useRef(null);
  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState(() => ({
    width: typeof window === "undefined" ? 1280 : window.innerWidth,
    height: typeof window === "undefined" ? 800 : window.innerHeight,
  }));
  const [near, setNear] = useState(false);

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    const width = Math.max(Math.round(bounds.width), 1);
    const height = Math.max(Math.round(bounds.height), 1);
    setViewport((prev) =>
      Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1
        ? prev
        : { width, height },
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    const el = viewportRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const isCompact = viewport.width < 1024;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion || isCompact) {
      setNear(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { root: null, rootMargin: "100% 0px 100% 0px", threshold: 0 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [reduceMotion, isCompact]);

  useEffect(() => {
    if (reduceMotion || isCompact) {
      targetProgress.current = 1;
      animatedProgress.current = 1;
      setProgress(1);
      return undefined;
    }
    if (!near || !rootRef.current) return undefined;

    const smoothness = 7;
    const startOffset = 0.55;

    const tick = (time) => {
      rafRef.current = null;
      const previous = lastTime.current ?? time;
      const delta = Math.min(Math.max((time - previous) / 1000, 0), 0.064);
      lastTime.current = time;
      const current = animatedProgress.current;
      const target = targetProgress.current;
      const next =
        current + (target - current) * (1 - Math.exp(-smoothness * delta));
      const done = Math.abs(target - next) < 1e-4;
      const finalProgress = done ? target : next;
      animatedProgress.current = finalProgress;
      setProgress(finalProgress);
      if (!done) rafRef.current = requestAnimationFrame(tick);
      else lastTime.current = null;
    };

    const updateTarget = () => {
      const root = rootRef.current;
      if (!root) return;
      const bounds = root.getBoundingClientRect();
      const lead = window.innerHeight * startOffset;
      const distance = Math.max(bounds.height - window.innerHeight, 1);
      targetProgress.current = clamp((lead - bounds.top) / distance);
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTime.current = null;
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, [near, reduceMotion, isCompact]);

  const count = items.length;
  const columns = 3;
  const rows = Math.ceil(count / columns);
  const gridGap = 16;
  const gridMaxWidth = 1160;
  const available = Math.max(viewport.width - 96, 200);
  const gridWidth = Math.min(gridMaxWidth, available);
  const cardWidth = Math.max(
    90,
    (gridWidth - gridGap * (columns - 1)) / columns,
  );
  const aspect = 1.48;
  const cardHeight = cardWidth / aspect;
  const gridHeight = rows * cardHeight + Math.max(rows - 1, 0) * gridGap;

  const arcCardWidth = Math.min(410, viewport.width * 0.28);
  const arcCardHeight = arcCardWidth / aspect;
  const curveWidth = Math.min(570, viewport.width * 0.44);
  const curveHeight = Math.min(210, viewport.height * 0.3);
  const depth = Math.min(520, viewport.width * 0.42);

  const titleEnter = smootherstep(0, 0.2, progress);
  const titleExit = smootherstep(0.6, 0.82, progress);
  const titleOpacity = titleEnter * (1 - titleExit);
  const titleShift = lerp(28, 0, titleEnter);
  const titleOffset = lerp(viewport.width * 0.7, 140, titleEnter);
  const copyOpacity =
    smootherstep(0.12, 0.25, progress) *
    (1 - smootherstep(0.58, 0.82, progress));
  const revealProgress = smootherstep(0, 0.17, progress);
  const orbitProgress = smootherstep(0.05, 0.7, progress);

  if (isCompact || reduceMotion) {
    return (
      <div className="orbit-compact" ref={rootRef}>
        <div ref={viewportRef}>
          <header className="orbit-compact-header">
            <h2>
              Shipped
              <br />
              projects
            </h2>
            <p>
              Six products from gap-finding to build — click any card to open
              it.
            </p>
          </header>
          <div className="orbit-compact-grid">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="orbit-compact-card"
              >
                <CardFace item={item} radius={12} />
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="orbit-root" ref={rootRef}>
      <div className="orbit-sticky" ref={viewportRef}>
        <div
          className="orbit-title orbit-title-left"
          aria-hidden="true"
          style={{
            opacity: titleOpacity,
            transform: `translate3d(calc(-100% - ${titleOffset}px), calc(-50% + ${titleShift}px), 0)`,
          }}
        >
          Shipped
        </div>
        <div
          className="orbit-title orbit-title-right"
          aria-hidden="true"
          style={{
            opacity: titleOpacity,
            transform: `translate3d(${titleOffset}px, calc(-50% - ${titleShift}px), 0)`,
          }}
        >
          Projects
        </div>
        <p className="orbit-copy" style={{ opacity: copyOpacity }}>
          Six products from gap-finding to build. Scroll to dock them.
        </p>

        <div className="orbit-stage">
          {items.map((item, index) => {
            const cardReveal = smootherstep(
              0.025 + index * 0.01,
              0.18 + index * 0.012,
              progress,
            );
            const flatten = smootherstep(
              0.56 + index * 0.009,
              Math.min(0.91 + index * 0.009, 0.99),
              progress,
            );
            const baseAngle = (index / Math.max(count, 1)) * 360 - 125;
            const angle = baseAngle + orbitProgress * 310;
            const radians = (angle * Math.PI) / 180;
            const arcX = Math.sin(radians) * curveWidth;
            const arcY =
              Math.cos(radians + 0.65) * curveHeight -
              viewport.height * 0.025 -
              40;
            const arcZ = Math.cos(radians) * depth;
            const normalized = clamp((arcZ + depth) / Math.max(depth * 2, 1));
            const arcScale = lerp(0.82, 1, normalized);
            const arcOpacity = lerp(0.2, 1, normalized);
            const arcRotateY = -Math.sin(radians) * 62;
            const arcRotateZ = -Math.sin(radians) * 8;
            const entrance = (1 - cardReveal) * viewport.height * 0.48;
            const column = index % columns;
            const row = Math.floor(index / columns);
            const gridLeft = -gridWidth / 2 + column * (cardWidth + gridGap);
            const gridTop =
              viewport.height * 0.52 -
              viewport.height / 2 -
              gridHeight / 2 +
              row * (cardHeight + gridGap);
            const width = lerp(arcCardWidth, cardWidth, flatten);
            const height = lerp(arcCardHeight, cardHeight, flatten);
            const x = lerp(arcX - arcCardWidth / 2, gridLeft, flatten);
            const y = lerp(
              arcY - arcCardHeight / 2 + entrance,
              gridTop,
              flatten,
            );
            const z = lerp(arcZ, 0, flatten);
            const rotateY = lerp(arcRotateY, 0, flatten);
            const rotateZ = lerp(arcRotateZ, 0, flatten);
            const scale = lerp(arcScale, 1, flatten);
            const opacity = clamp(
              lerp(arcOpacity * cardReveal * revealProgress, 1, flatten),
            );
            const zIndex =
              flatten > 0.86 ? 100 + index : Math.round(100 + normalized * 800);

            return (
              <a
                key={item.label}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="orbit-card"
                aria-label={`${item.label}: ${item.description || "Open project"}`}
                style={{
                  width,
                  height,
                  opacity,
                  zIndex,
                  transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                }}
              >
                <CardFace item={item} radius={12} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
