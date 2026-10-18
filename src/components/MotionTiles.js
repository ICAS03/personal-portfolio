import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./MotionTiles.css";

const spring = { type: "spring", bounce: 0.2, duration: 0.4 };

function slotFor(index, active, count) {
  if (index === active) return count - 1;
  return index < active ? index : index - 1;
}

export function MotionTiles({ items }) {
  const [active, setActive] = useState(0);
  const reduceMotion = !!useReducedMotion();
  const count = items.length;

  return (
    <div className="motion-tiles">
      <div
        className="motion-tiles-tags"
        role="tablist"
        aria-label="Featured projects"
      >
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={index === active}
            className={
              index === active ? "motion-tiles-tag is-active" : "motion-tiles-tag"
            }
            onClick={() => setActive(index)}
          >
            {item.title}
            {index < count - 1 ? "," : "."}
          </button>
        ))}
      </div>

      <div className="motion-tiles-stage">
        <div className="motion-tiles-fan">
          {items.map((item, index) => {
            const isActive = index === active;
            const slot = slotFor(index, active, count);
            const x = (slot - (count - 1) / 2) * 58;

            return (
              <motion.a
                key={item.title}
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isActive ? "motion-tiles-tile is-active" : "motion-tiles-tile"
                }
                aria-label={`${item.title}: ${item.description}`}
                style={{ zIndex: slot + 1 }}
                initial={false}
                animate={
                  reduceMotion
                    ? { x, y: 0, z: 0 }
                    : { x, y: 0, z: slot * 12 }
                }
                transition={reduceMotion ? { duration: 0 } : spring}
                onClick={(event) => {
                  if (!isActive) {
                    event.preventDefault();
                    setActive(index);
                  }
                }}
              >
                <img src={item.imgUrl} alt="" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
