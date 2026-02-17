const data = () => {
    const projectSections = [
      {
        title: "Design Projects",
        projects: [
          { type: "D1", title: "Logo Design", subtitle: "Creative logos and branding", gradient: "blue" },
          { type: "D2", title: "UI Mockups", subtitle: "High-fidelity interface designs", gradient: "teal" },
          { type: "D3", title: "Poster Design", subtitle: "Event and promotional posters", gradient: "yellow" },
          { type: "D4", title: "Photography", subtitle: "Landscape & portrait photography", gradient: "mixed" },
          { type: "D5", title: "Digital Illustration", subtitle: "Custom digital artworks", gradient: "blue" }
        ]
      },
      {
        title: "Back-End Projects",
        projects: [
          { type: "B.E.P1", title: "API Development", subtitle: "RESTful and GraphQL APIs", gradient: "teal" },
          { type: "B.E.P2", title: "Database Design", subtitle: "Schema and optimization work", gradient: "yellow" },
          { type: "B.E.P3", title: "E-commerce Platform", subtitle: "Back-end for online stores", gradient: "blue" },
          { type: "B.E.P4", title: "Authentication Systems", subtitle: "Secure login & user management", gradient: "mixed" }
        ]
      },
      {
        title: "Front-End Projects",
        projects: [
          { type: "F.E.P1", title: "Portfolio Website", subtitle: "Personal showcase site", gradient: "teal" },
          { type: "F.E.P2", title: "Dashboard UI", subtitle: "Interactive data dashboards", gradient: "blue" },
          { type: "F.E.P3", title: "Landing Pages", subtitle: "Marketing & product pages", gradient: "yellow" },
          { type: "F.E.P4", title: "Mobile UI Design", subtitle: "Cross-platform app interfaces", gradient: "mixed" }
        ]
      }
    ];
  
    return { projectSections };
  };
  
  // ✅ Correct export
  export default data;
  