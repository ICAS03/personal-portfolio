import { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import GradientASCII from "./GradientASCII";
import ProfileCard from "./ProfileCard";
import { TextArrowCta } from "./TextArrowCta";
import { SmartTypewriter } from "./SmartTypewriter";
import myImg from "../assets/img/my_img.png";

const LINKEDIN_URL = "https://www.linkedin.com/in/ivy-shin-3760b526a/";
const HERO_ROLES = [
  "Web Developer",
  "App Developer",
  "AI/ML Engineer",
  "Product Specialist",
];

export const Banner = () => {
  const sectionRef = useRef(null);
  const reduceMotion = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const asciiY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const asciiOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, 64]);

  return (
    <section className="banner" id="home" ref={sectionRef}>
      <motion.div
        className="banner-gradient"
        aria-hidden="true"
        style={reduceMotion ? undefined : { y: asciiY, opacity: asciiOpacity }}
      >
        <GradientASCII
          colors={["#3b82f6", "#d248ec", "#06b6d4", "#94a3b8"]}
          shape="horizon"
          characters=" =+xX0S8#@"
          cellSize={17}
          density={0.56}
          glyphOpacity={0.62}
          gradientOpacity={0.79}
          fontFamily='"Space Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
        />
      </motion.div>
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={7} xl={6}>
            <motion.div
              className="banner-copy"
              style={reduceMotion ? undefined : { y: copyY }}
            >
              <span className="tagline">Welcome to my Portfolio</span>
              <h1 aria-label={`Hi! I am Ivy - ${HERO_ROLES.join(", ")}`}>
                <span aria-hidden="true">
                  Hi! I am Ivy - <SmartTypewriter lines={HERO_ROLES} />
                </span>
              </h1>
              <p>
                Quick intro: My full name is Ivy Chung Ai Shin. People call me
                'AI' shin (for some reason).
              </p>
              <TextArrowCta href={LINKEDIN_URL}>Let's Connect</TextArrowCta>
            </motion.div>
          </Col>
          <Col xs={12} md={5} xl={6}>
            <motion.div style={reduceMotion ? undefined : { y: cardY }}>
              <div className="banner-card">
                <ProfileCard
                  name="Ivy Chung"
                  title="Product Specialist"
                  handle="ivy-shin"
                  status="Online"
                  contactText="Contact"
                  avatarUrl={myImg}
                  miniAvatarUrl={myImg}
                  holo={0.8}
                  glare={0.5}
                  tiltStrength={12}
                  parallax={0}
                  radius={16}
                  enableTilt
                  intro
                  showUserInfo
                  enableMobileTilt={false}
                  theme="dark"
                  onContactClick={() => window.open(LINKEDIN_URL, "_blank")}
                />
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
