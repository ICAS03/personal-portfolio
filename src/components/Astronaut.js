import { AsciiObject } from "./AsciiObject";
import astronaut from "../assets/img/astroIcon.png";

export const Astronaut = () => {
  return (
    <AsciiObject
      className="astronaut-stage"
      src={astronaut}
      cellSize={8}
      cellAspect={0.55}
      contrast={1.35}
      edgeContrast={2.4}
      exposure={1}
      environmentIntensity={0.85}
      roughness={0.55}
      scale={3.9}
      floatIntensity={1.1}
      rotationIntensity={0.25}
      floatSpeed={1.1}
      fov={50}
      cameraDistance={4.1}
      ascii
      colored
      invert={false}
      autoRotate={false}
      orbit={true}
      zoom={false}
      color="#ffffff"
      highlight="#b9a6ff"
    />
  );
};
