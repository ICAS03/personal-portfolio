# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers evaluating Ivy Chung for a role. Their job: judge fit quickly — what she builds, at what level, across which disciplines — and reach a contact decision within a short visit. Secondary audiences (clients, collaborators, peers) use the same evidence but are not the design target.

## Product Purpose

A personal portfolio that proves Ivy's range and positions her for hire. Success = a recruiter understands the product↔engineering bridge claim, sees credible proof (projects, skills, writing), and makes contact via LinkedIn or the contact form.

## Positioning

Product↔engineering bridge: she finds the gap in an existing process, then designs and builds the AI-powered solution end-to-end. A neighboring portfolio can list the same technologies; it cannot truthfully copy shipped products that span problem-finding through technical execution.

## Operating Context

Visited cold, typically from a LinkedIn profile, CV link, or referral — often skimmed on desktop during screening and on mobile between tasks. Evaluation is comparative: this site sits in a stack of candidate portfolios, so the claim and proof must land in the first viewport and survive a fast scroll.

## Capabilities and Constraints

- Single-page React site (Create React App): hero, skills, projects + writing, contact.
- Project proof is partly live: featured projects are curated locally; the full public GitHub list loads from the GitHub API at runtime (user `ICAS03`) and must degrade gracefully if that request fails.
- Heavy visual runtime is already committed (WebGL/canvas hero, glass contact visual, particle page treatment); new work must respect the existing performance budget.
- The contact form's backend endpoint is undecided/broken (`fetch` target is not a real service); do not present the form as a working delivery channel until that is fixed. LinkedIn is the reliable contact path.

## Brand Commitments

- Name: Ivy Chung. Voice on-page is first-person, direct, impact-first ("delivering valuable work that creates direct impact").
- Rotating role headline is factual: Web Developer, App Developer, AI/ML Engineer, Product Specialist.
- LinkedIn profile (ivy-shin-3760b526a) is the primary conversion destination.

## Evidence on Hand

- Six featured projects with images and repository/product links (`src/components/Project.js`).
- Live GitHub repository list via the public API (19+ public repos at last check).
- Skills inventory with proficiency levels (`src/components/Skills.js`).
- Long-form writing embedded from the author's blog (ivychungaishin.blogspot.com).
- No testimonials, employer logos, metrics, or case-study outcomes exist yet — future work must not fabricate them.

## Product Principles

1. Proof over claims: every assertion on the page points at a project, a skill, or a piece of writing.
2. First-viewport clarity: role, claim, and contact path readable without scrolling.
3. Live data, honest failure: external content (GitHub, blog) shows a real fallback instead of a blank or fake state.
4. Motion serves the material: effects embody the site's particle/glyph world or explain state — never decoration for its own sake.
5. No fabricated evidence: no invented testimonials, numbers, or clients.

## Accessibility & Inclusion

- `prefers-reduced-motion` must keep the whole page legible and navigable (the site already branches on it; new motion must too).
- No other formal standard (e.g. WCAG target) has been established yet.
