import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CircularCarousel } from "./CircularCarousel";
import { OrbitProjects } from "./OrbitProjects";
import { ConstellationGrid } from "./ConstellationGrid";
import { ScrollText } from "./ScrollText";
import { GithubGraph } from "./GithubGraph";
import proimg1 from "../assets/img/proimg1.png";
import proimg2 from "../assets/img/proimg2.jpeg";
import proimg3 from "../assets/img/proimg3.png";
import proimg4 from "../assets/img/proimg4.png";
import proimg5 from "../assets/img/proimg5.png";
import proimg6 from "../assets/img/proimg6.png";

const GITHUB_USER = "ICAS03";
const EXCLUDED_REPO = "personal-portfolio";
const FEATURED_REPO_URLS = new Set(
  [
    "https://github.com/ICAS03/EatUp-Project",
    "https://github.com/ICAS03/gcp-waterguard",
    "https://github.com/ICAS03/xcesscity",
    "https://github.com/ICAS03/eth_taipei_final",
    "https://github.com/ICAS03/agentic-main",
  ].map((url) => url.toLowerCase()),
);

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

  const [showWriting, setShowWriting] = useState(false);
  const [writingReady, setWritingReady] = useState(false);
  const [githubProjects, setGithubProjects] = useState([]);
  const [githubStatus, setGithubStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    const loadGithubProjects = async () => {
      try {
        const all = [];
        for (let page = 1; ; page++) {
          const response = await fetch(
            `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&page=${page}&sort=updated`,
          );
          if (!response.ok) throw new Error("GitHub request failed");
          const data = await response.json();
          all.push(...data);
          if (data.length < 100) break;
        }
        if (cancelled) return;
        setGithubProjects(
          all.filter(
            (repo) =>
              repo.name.toLowerCase() !== EXCLUDED_REPO &&
              !FEATURED_REPO_URLS.has(repo.html_url.toLowerCase()),
          ),
        );
        setGithubStatus("ready");
      } catch {
        if (!cancelled) setGithubStatus("error");
      }
    };

    loadGithubProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!showWriting) return undefined;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.getElementById("project-writing")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    return undefined;
  }, [showWriting]);

  return (
    <section className="project" id="project">
      <ConstellationGrid />
      <h2 className="visually-hidden">Projects</h2>
      <OrbitProjects
        items={projects.map((project) => ({
          image: project.imgUrl,
          label: project.title,
          description: project.description,
          link: project.githubUrl,
        }))}
      />
      <Container>
        <Row>
          <Col size={12}>
            <div
              className="project-switch"
              role="tablist"
              aria-label="Project section"
            >
              <button
                type="button"
                role="tab"
                aria-selected={!showWriting}
                className={!showWriting ? "is-active" : ""}
                onClick={() => setShowWriting(false)}
              >
                App/Web Developments
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={showWriting}
                className={showWriting ? "is-active" : ""}
                onClick={() => {
                  setWritingReady(true);
                  setShowWriting(true);
                }}
              >
                Game Developments
              </button>
            </div>
            <ScrollText
              as="h3"
              className="github-heading"
              text="More on GitHub"
            />
            <GithubGraph username={GITHUB_USER} />
            {githubStatus === "loading" && (
              <p className="github-status">
                Loading more projects from GitHub…
              </p>
            )}
            {githubStatus === "error" && (
              <p className="github-status">
                More projects live on{" "}
                <a
                  href={`https://github.com/${GITHUB_USER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                .
              </p>
            )}
            {githubStatus === "ready" && githubProjects.length > 0 && (
              <>
                <CircularCarousel
                  autoPlay
                  items={githubProjects.map((repo) => ({
                    id: String(repo.id),
                    title: repo.name,
                    description: repo.description || "No description yet.",
                    tag: repo.fork ? "Fork" : repo.language,
                    url: repo.html_url,
                  }))}
                />
              </>
            )}
            <div
              id="project-writing"
              className={`project-writing${showWriting ? " is-open" : ""}`}
            >
              <div className="project-writing-inner">
                <ScrollText
                  as="h3"
                  className="github-heading"
                  text="Game Development Portfolio"
                />
                {writingReady && (
                  <div className="scene-blog">
                    <iframe
                      src="https://ivychungaishin.blogspot.com/"
                      title="Ivy Chung's Blog"
                    />
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
