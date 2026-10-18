import { useReducedMotion, motion } from "motion/react";
import "./TextArrowCta.css";

const spring = { type: "spring", bounce: 0.3, duration: 1 };

const leftArrow = {
  rest: { opacity: 0, rotate: -90, scale: 0 },
  hover: { opacity: 1, rotate: 0, scale: 1 },
};

const rightArrow = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: -90, scale: 0 },
};

const lineLeft = {
  rest: { width: "1%", left: -3, transition: spring },
  hover: {
    width: "100%",
    left: 0,
    transition: { ...spring, delay: 0.3 },
  },
};

const lineRight = {
  rest: {
    width: "100%",
    right: 0,
    transition: { ...spring, delay: 0.3 },
  },
  hover: { width: "1%", right: -3, transition: spring },
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 15" width="20" height="15" aria-hidden="true">
      <path
        d="M0 6.5h18M11.7 0L18 6.5 11.7 13"
        transform="translate(1 1)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TextArrowCta({ href, children }) {
  const reduceMotion = !!useReducedMotion();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-arrow-cta"
      initial="rest"
      animate="rest"
      whileHover={reduceMotion ? "rest" : "hover"}
      whileFocus={reduceMotion ? "rest" : "hover"}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
    >
      <span className="text-arrow-cta-row">
        <motion.span
          className="text-arrow-cta-arrow is-left"
          variants={leftArrow}
          transition={spring}
          aria-hidden="true"
        >
          <ArrowIcon />
        </motion.span>
        <span className="text-arrow-cta-label">{children}</span>
        <motion.span
          className="text-arrow-cta-arrow is-right"
          variants={rightArrow}
          transition={spring}
          aria-hidden="true"
        >
          <ArrowIcon />
        </motion.span>
      </span>
      <span className="text-arrow-cta-underline" aria-hidden="true">
        <motion.span className="text-arrow-cta-line is-left" variants={lineLeft} />
        <motion.span className="text-arrow-cta-line is-right" variants={lineRight} />
      </span>
    </motion.a>
  );
}
