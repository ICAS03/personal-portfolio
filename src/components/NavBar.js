import { useEffect, useState } from "react";
import logo from "../assets/img/logo.svg";

const LINKEDIN_URL = "https://www.linkedin.com/in/ivy-shin-3760b526a/";

const links = [
  { href: "#home", id: "home", label: "Home" },
  { href: "#skills", id: "skills", label: "Skills" },
  { href: "#project", id: "project", label: "Projects" },
];

function SlideLink({ href, label, active, onClick }) {
  return (
    <a
      href={href}
      className={active ? "site-nav-link active" : "site-nav-link"}
      onClick={onClick}
    >
      <span>{label}</span>
      <span aria-hidden="true">{label}</span>
    </a>
  );
}

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const goTo = (id) => {
    setActiveLink(id);
    setMenuOpen(false);
  };

  return (
    <header className="site-nav-wrap">
      <nav
        className={scrolled ? "site-nav scrolled" : "site-nav"}
        aria-label="Primary"
      >
        <a href="#home" className="site-nav-brand" onClick={() => goTo("home")}>
          <img src={logo} alt="Ivy Chung" />
        </a>

        <div className="site-nav-links">
          {links.map((link) => (
            <SlideLink
              key={link.id}
              href={link.href}
              label={link.label}
              active={activeLink === link.id}
              onClick={() => goTo(link.id)}
            />
          ))}
        </div>

        <div className="site-nav-actions">
          <button
            type="button"
            className="site-nav-cta"
            onClick={() => window.open(LINKEDIN_URL, "_blank", "noopener")}
          >
            Let's Connect
          </button>
        </div>

        <button
          type="button"
          className="site-nav-toggle"
          aria-controls="site-nav-mobile"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div
          id="site-nav-mobile"
          className={menuOpen ? "site-nav-mobile open" : "site-nav-mobile"}
        >
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={
                activeLink === link.id
                  ? "site-nav-mobile-link active"
                  : "site-nav-mobile-link"
              }
              onClick={() => goTo(link.id)}
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            className="site-nav-cta"
            onClick={() => {
              setMenuOpen(false);
              window.open(LINKEDIN_URL, "_blank", "noopener");
            }}
          >
            Let's Connect
          </button>
        </div>
      </nav>
    </header>
  );
};
