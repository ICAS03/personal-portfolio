import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import "./SmartTypewriter.css";

const START_DELAY = 400;
const TYPE_SPEED = 45;
const DELETE_SPEED = 30;
const PAUSE_AFTER_TYPE = 900;
const PAUSE_AFTER_DELETE = 300;
const COMMA_PAUSE = 140;
const PERIOD_PAUSE = 320;
const ELLIPSIS_PAUSE = 520;
const TRAIL_CHARS = 3;
const BLINK_MS = 500;

function nextTypedValue(full, current) {
  return full.slice(0, Math.min(full.length, current.length + 1));
}

function nextDelay(full, current) {
  const prev = full[Math.max(0, current.length - 1)] || "";
  const prev3 = full.slice(Math.max(0, current.length - 3), current.length);
  if (prev3 === "...") return TYPE_SPEED + ELLIPSIS_PAUSE;
  if (prev === "," || prev === ";") return TYPE_SPEED + COMMA_PAUSE;
  if (prev === "." || prev === "!" || prev === "?") {
    return TYPE_SPEED + PERIOD_PAUSE;
  }
  return TYPE_SPEED;
}

function useInViewport(ref) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: "100px 0px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return visible;
}

function TrailText({ text, trail }) {
  if (!trail || text.length === 0) return text;
  const split = Math.max(0, text.length - TRAIL_CHARS);
  return (
    <>
      {text.slice(0, split)}
      <span className="smart-type-trail">{text.slice(split)}</span>
    </>
  );
}

export function SmartTypewriter({ lines, className }) {
  const reduceMotion = !!useReducedMotion();
  const rootRef = useRef(null);
  const inView = useInViewport(rootRef);
  const blocks = useMemo(
    () => (lines?.length ? lines : [""]),
    [lines],
  );

  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState("idleDelay");
  const [caretOn, setCaretOn] = useState(true);

  const current = blocks[index] || "";
  const longest = blocks.reduce(
    (best, line) => (line.length > best.length ? line : best),
    blocks[0] || "",
  );

  useEffect(() => {
    if (reduceMotion) return undefined;
    const tick = window.setInterval(() => setCaretOn((on) => !on), BLINK_MS);
    return () => window.clearInterval(tick);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !inView) return undefined;

    const later = (fn, ms) => {
      const id = window.setTimeout(fn, Math.max(0, ms));
      return () => window.clearTimeout(id);
    };

    if (phase === "idleDelay") {
      return later(() => setPhase("typing"), START_DELAY);
    }

    if (phase === "typing") {
      if (value.length >= current.length) {
        return later(() => setPhase("pauseAfterType"), 0);
      }
      return later(
        () => setValue(nextTypedValue(current, value)),
        nextDelay(current, value),
      );
    }

    if (phase === "pauseAfterType") {
      return later(() => setPhase("deleting"), PAUSE_AFTER_TYPE);
    }

    if (phase === "deleting") {
      if (value.length === 0) {
        return later(() => setPhase("pauseAfterDelete"), 0);
      }
      return later(() => setValue((prev) => prev.slice(0, -1)), DELETE_SPEED);
    }

    return later(() => {
      setIndex((i) => (i + 1) % blocks.length);
      setValue("");
      setPhase("typing");
    }, PAUSE_AFTER_DELETE);
  }, [reduceMotion, inView, phase, value, current, blocks.length]);

  if (reduceMotion) {
    return (
      <span className={className} ref={rootRef}>
        {blocks[0]}
      </span>
    );
  }

  const typing = phase === "typing";

  return (
    <span
      ref={rootRef}
      className={`smart-type${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <span className="smart-type-stack">
        <span className="smart-type-ghost" aria-hidden="true">
          {longest}
        </span>
        <span className="smart-type-live" aria-hidden="true">
          <span className="smart-type-line">
            <TrailText text={value} trail={typing} />
            <span
              className={`smart-type-caret${caretOn ? " is-on" : ""}`}
            />
          </span>
        </span>
      </span>
    </span>
  );
}
