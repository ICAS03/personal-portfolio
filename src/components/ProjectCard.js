import { Col } from "react-bootstrap";
import { motion, useReducedMotion } from "motion/react";

export const ProjectCard = ({
  title,
  description,
  imgUrl,
  githubUrl,
  index = 0,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <Col size={12} sm={6} md={4}>
      <motion.a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="proj-card-link"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 22,
          delay: Math.min(index, 5) * 0.08,
        }}
        whileHover={reduceMotion ? undefined : { y: -10, scale: 1.03, rotate: -0.6 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      >
        <div className="proj-imgbx">
          <img src={imgUrl} alt={title}></img>
          <div className="proj-txtx">
            <h4>{title}</h4>
            <span>{description}</span>
          </div>
        </div>
      </motion.a>
    </Col>
  );
};
