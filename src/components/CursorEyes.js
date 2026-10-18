import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import "./CursorEyes.css";

const EYE_WIDTH = 46;
const EYE_HEIGHT = 26;
const MAX_WIDTH = 320;
const FOLLOW_RADIUS = 10;

function Eye() {
  const ref = useRef(null);
  const reduceMotion = !!useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion) return undefined;

    const handleMove = (event) => {
      const node = ref.current;
      if (!node) return;
      const bounds = node.getBoundingClientRect();
      const dx = event.clientX - (bounds.left + bounds.width / 2);
      const dy = event.clientY - (bounds.top + bounds.height / 2);
      const localScale = bounds.height / 22 || 1;
      const distance = Math.min(FOLLOW_RADIUS, Math.hypot(dx, dy) / localScale);
      const angle = Math.atan2(dy, dx);
      setOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reduceMotion]);

  return (
    <div className="cursor-eye">
      <div className="cursor-eye-sclera" />
      <div
        ref={ref}
        className="cursor-eye-pupil"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        <span className="cursor-eye-iris" />
        <span className="cursor-eye-glint" />
      </div>
    </div>
  );
}

export function CursorEyes() {
  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const measure = () => {
      const width = stage.clientWidth;
      const next = Math.min(width, MAX_WIDTH) / EYE_WIDTH;
      setScale(next > 0 ? next : 1);
    };

    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="cursor-eyes-stage"
      ref={stageRef}
      style={{ height: EYE_HEIGHT * scale }}
      aria-hidden="true"
    >
      <div className="cursor-eyes" style={{ transform: `scale(${scale})` }}>
        <Eye />
        <Eye />
      </div>
    </div>
  );
}
