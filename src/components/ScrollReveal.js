import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "./motion-tokens";

export function ScrollReveal({ children, className }) {
  const reduceMotion = !!useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: motionTokens.duration.considered,
        ease: motionTokens.ease.enter,
      }}
    >
      {children}
    </motion.div>
  );
}
