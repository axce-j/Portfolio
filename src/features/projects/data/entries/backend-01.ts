import type { SingleProject } from "../singleProjectData";

// ─────────────────────────────────────────────
// Image paths — place files at:
//   public/projects/backend-01/hero.jpg
//   public/projects/backend-01/feature-1.jpg
//   public/projects/backend-01/feature-2.jpg
//   public/projects/backend-01/feature-3.jpg
//   public/projects/backend-01/highlight.jpg
// ─────────────────────────────────────────────

const BASE = "/projects/backend-01";

const backend01: SingleProject = {
  id: "backend-01",

//   heroImage:    `${BASE}/hero.jpg`,
heroImage: ``,

  heroImageAlt: "API architecture diagram",

  intro: {
    title:       "API Development",
    tagline:     "The invisible layer that makes products work.",
    description:
      "APIs are the backbone of every modern product. This covers the design and implementation of production-grade REST and GraphQL APIs — built for real traffic, real auth requirements, and real failure modes. Target users range from mobile client developers to third-party integrators.",
    tags: ["Node.js", "Express", "GraphQL", "PostgreSQL"],
  },

  features: [
    {
      id:          "backend-01-f1",
      title:       "Auth & Access Control",
      subtitle:    "JWT + RBAC from scratch",
      description:
        "Authentication was implemented using short-lived JWTs paired with refresh token rotation — stored in httpOnly cookies to prevent XSS exposure. Role-based access control was enforced at the middleware layer, keeping business logic clean.",
      image:       `${BASE}/feature-1.jpg`,
      imageAlt:    "Auth flow diagram",
    },
    {
      id:          "backend-01-f2",
      title:       "GraphQL Layer",
      subtitle:    "Flexible queries, no overfetching",
      description:
        "A GraphQL API was layered over the existing REST endpoints using Apollo Server — giving frontend clients precise control over what data they fetch. Dataloader was used to solve the N+1 query problem and keep database round-trips minimal.",
      image:       `${BASE}/feature-2.jpg`,
      imageAlt:    "GraphQL playground screenshot",
    },
    {
      id:          "backend-01-f3",
      title:       "Observability & Testing",
      subtitle:    "You can't fix what you can't see",
      description:
        "Every endpoint is covered by integration tests using Jest and Supertest. Structured logging and error tracking were wired up so production issues surface fast and with enough context to debug without guessing.",
      image:       `${BASE}/feature-3.jpg`,
      imageAlt:    "Test coverage report",
    },
  ],

  highlight: {
    title:       "Deployment & Infrastructure",
    subtitle:    "Production-ready from day one",
    description:
      "All services were containerised with Docker and deployed to AWS with auto-scaling. Health checks, rate limiting, and environment-based config management ensured the APIs were stable and secure in production from the first release.",
    image:       `${BASE}/highlight.jpg`,
    imageAlt:    "Docker and AWS deployment diagram",
  },

  takeaway: {
    title:       "Takeaway",
    subtitle:    "Boring infrastructure, exciting products",
    description:
      "The best APIs are the ones nobody notices. Reliability, predictable error shapes, and clear documentation matter far more than clever architecture. The hardest part isn't writing the code — it's writing it so the next developer isn't lost.",
  },

  links: {
    github: "https://github.com/axce-j",
  },

  techStack: ["Node.js", "Express", "GraphQL", "PostgreSQL", "Redis", "Docker"],
  year:      2024,
  role:      "Back-End Developer",
  duration:  "3 months",
};

export default backend01;