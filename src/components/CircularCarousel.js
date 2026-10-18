import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

const VISIBLE_COUNT = 5;

function getItemPosition(index, activeIndex, total, radiusX, radiusY) {
  const offset = index - activeIndex;
  const half = Math.floor(VISIBLE_COUNT / 2);
  let adjustedOffset = offset;

  if (offset > half) adjustedOffset = offset - total;
  if (offset < -half) adjustedOffset = offset + total;
  if (Math.abs(adjustedOffset) > half) return null;

  const angle = (adjustedOffset / VISIBLE_COUNT) * Math.PI;
  const distance = Math.abs(adjustedOffset);
  const maxDistance = half + 0.35;

  return {
    x: Math.sin(angle) * radiusX,
    y: Math.cos(angle) * radiusY,
    z: -distance * 70,
    rotateY: -adjustedOffset * 24,
    rotateZ: -adjustedOffset * 5,
    scale: distance === 0 ? 1 : Math.max(0.72, 1 - (distance / maxDistance) * 0.38),
    opacity: distance === 0 ? 1 : Math.max(0.4, 1 - (distance / maxDistance) * 0.55),
    zIndex: VISIBLE_COUNT - distance,
  };
}

export const CircularCarousel = ({
  items,
  autoPlay = false,
  autoPlayInterval = 4000,
}) => {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [radiusX, setRadiusX] = useState(360);
  const [radiusY, setRadiusY] = useState(150);
  const total = items.length;
  const activeItem = items[activeIndex];
  const motionTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.65, ease: [0.22, 1, 0.36, 1] };

  const goTo = useCallback(
    (index) => {
      if (!total) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const update = () => {
      const width = track.clientWidth;
      const nextX = Math.min(420, Math.max(140, width * 0.36));
      setRadiusX(nextX);
      setRadiusY(Math.max(110, nextX * 0.4));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoPlay || reduceMotion || isHovered || isFocused || total < 2) {
      return undefined;
    }
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [
    autoPlay,
    autoPlayInterval,
    isFocused,
    isHovered,
    next,
    reduceMotion,
    total,
  ]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const handler = (event) => {
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [next, prev]);

  if (!total || !activeItem) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="GitHub projects carousel"
      aria-roledescription="carousel"
      className="circular-carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="circular-carousel-track" ref={trackRef}>
        <div className="circular-carousel-index" aria-hidden="true">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <small>of {String(total).padStart(2, "0")}</small>
        </div>
        <AnimatePresence>
          {items.map((item, i) => {
            const pos = getItemPosition(
              i,
              activeIndex,
              total,
              radiusX,
              radiusY,
            );
            if (!pos) return null;

            const isActive = i === activeIndex;
            return (
              <motion.button
                key={item.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                animate={{
                  x: pos.x,
                  y: pos.y,
                  z: reduceMotion ? 0 : pos.z,
                  rotateY: reduceMotion ? 0 : pos.rotateY,
                  rotateZ: reduceMotion ? 0 : pos.rotateZ,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  zIndex: pos.zIndex,
                }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
                transition={motionTransition}
                onClick={() => {
                  if (isActive && item.url) {
                    window.open(item.url, "_blank", "noopener,noreferrer");
                    return;
                  }
                  goTo(i);
                }}
                aria-label={
                  isActive ? `Open ${item.title} on GitHub` : item.title
                }
                aria-selected={isActive}
                role="option"
                className={`circular-carousel-card${isActive ? " is-active" : ""}`}
                style={{ zIndex: pos.zIndex }}
              >
                {item.tag && (
                  <span className="circular-carousel-tag">{item.tag}</span>
                )}
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="circular-carousel-controls">
        <motion.button
          type="button"
          whileHover={reduceMotion ? undefined : { scale: 1.08 }}
          whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          onClick={prev}
          aria-label="Previous GitHub project"
          className="circular-carousel-nav"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <div className="circular-carousel-dots" role="tablist">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to ${item.title}`}
              className={`circular-carousel-dot${i === activeIndex ? " is-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <motion.button
          type="button"
          whileHover={reduceMotion ? undefined : { scale: 1.08 }}
          whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          onClick={next}
          aria-label="Next GitHub project"
          className="circular-carousel-nav"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
};
