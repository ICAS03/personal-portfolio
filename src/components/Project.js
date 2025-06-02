import { Container, Row, Col, Tab, Nav, TabContainer } from "react-bootstrap";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { OrbitControls, Text } from "@react-three/drei";
import { ProjectCard } from "./ProjectCard";
import proimg1 from "../assets/img/proimg1.png";
import proimg2 from "../assets/img/proimg2.jpeg";
import proimg3 from "../assets/img/proimg3.png";
import proimg4 from "../assets/img/proimg4.png";
import proimg5 from "../assets/img/proimg5.jpeg";
import proimg6 from "../assets/img/proimg6.png";

export const Project = () => {
  const projects = [
    {
      title: "EatUp",
      description: "A Food Notifying Application",
      imgUrl: proimg1,
      githubUrl: "https://github.com/ICAS03/EatUp-Project",
    },
    {
      title: "WaterGuard",
      description: "A Flood Monitoring Application",
      imgUrl: proimg2,
      githubUrl: "https://github.com/ICAS03/gcp-waterguard",
    },
    {
      title: "XcessCITY",
      description: "A Pot-Hole Detector Application",
      imgUrl: proimg3,
      githubUrl: "https://github.com/ICAS03/xcesscity",
    },
    {
      title: "Mini Amor",
      description: "A Dating World Mini App",
      imgUrl: proimg4,
      githubUrl: "https://github.com/ICAS03/eth_taipei_final",
    },
    {
      title: "HireDash",
      description: "An AI Pre-Screening Application",
      imgUrl: proimg5,
      githubUrl: "https://hire-dash.com/",
    },
    {
      title: "AI3 Nexus",
      description: "A Web3-based AI Chatbot",
      imgUrl: proimg6,
      githubUrl: "https://github.com/ICAS03/agentic-main",
    },
  ];

  const Sphere = ({ position, args, color }) => {
    const ref = useRef();

    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useFrame((state, delta) => {
      const speed = isHovered ? 1 : 0.2;
      ref.current.rotation.y += delta * speed;
    });

    return (
      <>
        <mesh
          position={position}
          ref={ref}
          onPointerEnter={(event) => (
            event.stopPropagation(), setIsHovered(true)
          )}
          onPointerLeave={() => setIsHovered(false)}
          onClick={() => setIsClicked(!isClicked)}
          scale={isClicked ? 1.5 : 1}
        >
          <sphereGeometry args={args} />
          <meshStandardMaterial
            color={isHovered ? "lightblue" : "orange"}
            wireframe
          />
        </mesh>
        <Text
          position={[position[0], position[1] + 3, position[2]]}
          fontSize={0.5}
          color="white"
        >
          To Be Updated
        </Text>
      </>
    );
  };

  return (
    <section className="project" id="project">
      <Container>
        <Row>
          <Col size={12}>
            <h2>Projects</h2>
            <p>
              Explore a collection of my previous projects, showcasing a diverse
              range of innovative solutions and creative applications.
            </p>
            <Tab.Container id="projects-tabs" defaultActiveKey="first">
              <Nav
                variant="pills"
                className="nav-pills mb-5 justify-content-center align-items-center"
                id="pills-tab"
              >
                <Nav.Item>
                  <Nav.Link eventKey="first">TAB 1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">TAB 2</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third">TAB 3</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Row>
                    {projects.map((project, index) => {
                      return (
                        <ProjectCard key={index} {...project}></ProjectCard>
                      );
                    })}
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <iframe
                    src="https://ivychungaishin.blogspot.com/"
                    style={{ width: "100%", height: "500px", border: "none" }}
                    title="Ivy Chung's Blog"
                  ></iframe>
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <Canvas style={{ height: "500px" }}>
                    <ambientLight intensity={0.5} />
                    <Sphere
                      position={[0, 0, 0]}
                      args={[1.5, 45, 45]}
                      color={"orange"}
                    />
                    <OrbitControls enableZoom={false} />
                  </Canvas>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
