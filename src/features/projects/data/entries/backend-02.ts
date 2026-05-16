// src/features/projects/data/entries/backend-02.ts

import type { SingleProject } from "../singleProjectData";

const BASE = "/projects/backend-02";

const backend02: SingleProject = {
  id: "backend-02",

//   heroImage: `${BASE}/hero.jpg`,
  heroImage: ``,
  heroImageAlt: "Authentication system architecture",

  intro: {
    title: "Authentication API",
    tagline: "Secure authentication flow with email verification.",
    description:
      "A backend authentication system built with JWT sessions, email verification, and optional two-factor authentication.",

    tags: ["NestJS", "JWT", "PostgreSQL", "Authentication"],
  },

  features: [
    {
      id: "backend-02-f1",
      title: "JWT Authentication",
      subtitle: "Secure session handling",
      description:
        "Authentication tokens were managed with HTTP-only cookies and protected routes.",

      image: `${BASE}/feature-1.jpg`,
      imageAlt: "JWT flow",
    },

    {
      id: "backend-02-f2",
      title: "Email Verification",
      subtitle: "Account validation system",
      description:
        "New users receive verification emails before activating their accounts.",

      image: `${BASE}/feature-2.jpg`,
      imageAlt: "Email verification",
    },

    {
      id: "backend-02-f3",
      title: "2FA Support",
      subtitle: "Additional security layer",
      description:
        "Optional OTP-based two-factor authentication was integrated into login flows.",

      image: `${BASE}/feature-3.jpg`,
      imageAlt: "Two-factor authentication",
    },
  ],

  highlight: {
    title: "Security Focus",
    subtitle: "Backend reliability",
    description:
      "Validation, protected routes, and token handling were structured to reduce common authentication vulnerabilities.",

    image: `${BASE}/highlight.jpg`,
    imageAlt: "Backend security architecture",
  },

  takeaway: {
    title: "Takeaway",
    subtitle: "Backend systems need clarity",
    description:
      "Strong backend architecture depends heavily on predictable flows and maintainable structure.",

  },

  links: {
    github: "https://github.com/axce-j",
  },

  techStack: ["NestJS", "PostgreSQL", "JWT"],

  year: 2025,
  role: "Backend Developer",
  duration: "3 weeks",
};

export default backend02;