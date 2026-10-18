import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Gauge } from "./Gauge";
import { ScrollReveal } from "./ScrollReveal";
import { ScrollText } from "./ScrollText";

const skills = [
  { label: "Web Development", value: 80 },
  { label: "App Development", value: 80 },
  { label: "Certified Cloud Engineer", value: 95 },
  { label: "UI/UX Designer", value: 100 },
  { label: "3D Modelling", value: 95 },
  { label: "Game Design", value: 80 },
  { label: "Game Development", value: 80 },
];

const skillThresholds = [
  { from: 0, tone: "accent", label: "Working" },
  { from: 70, tone: "success", label: "Proficient" },
  { from: 90, tone: "accent", label: "Strong" },
];

export const Skills = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <section className="skill" id="skills">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ScrollReveal>
            <div className="skill-bx">
              <ScrollText as="h2" text="Skills" />
              <ScrollText
                as="p"
                text="These are skills that I have attained and achieved over the course of 3 years. With high desire in learning, more skills will be further developed or polished"
              />
              <Carousel
                responsive={responsive}
                infinite={true}
                className="skill-slider"
              >
                {skills.map((skill) => (
                  <div className="item" key={skill.label}>
                    <Gauge
                      label={skill.label}
                      value={skill.value}
                      thresholds={skillThresholds}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
