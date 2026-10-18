import { motion, useReducedMotion } from "motion/react";
import { motionTokens } from "./motion-tokens";

export function ScrollText({ as: Tag = "p", text, className }) {
  const reduceMotion = !!useReducedMotion();
  const words = text.trim().split(/\s+/);

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="scroll-text-word"
          aria-hidden="true"
          initial={{
            opacity: 0,
            y: "0.45em",
            filter: `blur(${motionTokens.blur.text}px)`,
          }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{
            duration: motionTokens.duration.standard,
            ease: motionTokens.ease.enter,
            delay: index * motionTokens.stagger.word,
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
