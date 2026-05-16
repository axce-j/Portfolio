// src/features/projects/data/entries/backend-03.ts

import type { SingleProject } from "../singleProjectData";

const BASE = "/projects/backend-03";

const backend03: SingleProject = {
  id: "backend-03",

//   heroImage: `${BASE}/hero.jpg`,
heroImage: ``,

  heroImageAlt: "Realtime websocket architecture",

  intro: {
    title: "Realtime Notification System",
    tagline: "Event-driven backend communication.",
    description:
      "A realtime backend service designed to handle websocket-based notifications and live updates efficiently.",

    tags: ["NestJS", "WebSockets", "Redis", "Realtime"],
  },

  features: [
    {
      id: "backend-03-f1",
      title: "Realtime Gateway",
      subtitle: "Persistent websocket communication",
      description:
        "The system maintains persistent client connections for low-latency updates.",

      image: `${BASE}/feature-1.jpg`,
      imageAlt: "Websocket gateway",
    },

    {
      id: "backend-03-f2",
      title: "Redis Pub/Sub",
      subtitle: "Scalable event handling",
      description:
        "Redis pub/sub was used to distribute realtime events efficiently.",

      image: `${BASE}/feature-2.jpg`,
      imageAlt: "Redis pubsub architecture",
    },

    {
      id: "backend-03-f3",
      title: "Notification Queue",
      subtitle: "Reliable event delivery",
      description:
        "Queued event handling prevents notification loss during traffic spikes.",

      image: `${BASE}/feature-3.jpg`,
      imageAlt: "Notification queue system",
    },
  ],

  highlight: {
    title: "Scalable Infrastructure",
    subtitle: "Designed for concurrency",
    description:
      "The architecture supports multiple simultaneous connections without blocking application performance.",

    image: `${BASE}/highlight.jpg`,
    imageAlt: "Realtime infrastructure",
  },

  takeaway: {
    title: "Takeaway",
    subtitle: "Realtime systems are architecture-heavy",
    description:
      "Realtime features require careful planning around scalability, persistence, and event flow reliability.",

  },

  links: {
    github: "https://github.com/axce-j",
  },

  techStack: ["NestJS", "Redis", "Socket.IO"],

  year: 2025,
  role: "Backend Engineer",
  duration: "4 weeks",
};

export default backend03;