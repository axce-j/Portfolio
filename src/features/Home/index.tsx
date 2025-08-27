import React from "react";
import ProjectCard from "../../components/ui/cards";

const HomeIndex = () => {
  const name: string = "Ezeani Obinna Jachike";
  
  // Project sections data
  const projectSections = [
    {
      title: "Design Projects",
      projects: [
        {
          title: "Logo Design",
          subtitle: "Creative logos and branding",
          gradient: "blue"
        },
        {
          title: "UI Mockups",
          subtitle: "High-fidelity interface designs",
          gradient: "teal"
        },
        {
          title: "Poster Design",
          subtitle: "Event and promotional posters",
          gradient: "yellow"
        },
        {
          title: "Photography",
          subtitle: "Landscape & portrait photography",
          gradient: "mixed"
        },
        {
          title: "Digital Illustration",
          subtitle: "Custom digital artworks",
          gradient: "blue"
        }
      ]
    },
    {
      title: "Back-End Projects",
      projects: [
        {
          title: "API Development",
          subtitle: "RESTful and GraphQL APIs",
          gradient: "teal"
        },
        {
          title: "Database Design",
          subtitle: "Schema and optimization work",
          gradient: "yellow"
        },
        {
          title: "E-commerce Platform",
          subtitle: "Back-end for online stores",
          gradient: "blue"
        },
        {
          title: "Authentication Systems",
          subtitle: "Secure login & user management",
          gradient: "mixed"
        }
      ]
    },
    {
      title: "Front-End Projects",
      projects: [
        {
          title: "Portfolio Website",
          subtitle: "Personal showcase site",
          gradient: "teal"
        },
        {
          title: "Dashboard UI",
          subtitle: "Interactive data dashboards",
          gradient: "blue"
        },
        {
          title: "Landing Pages",
          subtitle: "Marketing & product pages",
          gradient: "yellow"
        },
        {
          title: "Mobile UI Design",
          subtitle: "Cross-platform app interfaces",
          gradient: "mixed"
        }
      ]
    }
  ];
  
  // Add CSS for hiding scrollbars
  const scrollbarHideStyle = {
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
  };

  const addWebkitScrollbarHide = () => {
    const style = document.createElement('style');
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    if (!document.head.querySelector('[data-scrollbar-hide]')) {
      style.setAttribute('data-scrollbar-hide', 'true');
      document.head.appendChild(style);
    }
  };

  // Apply the webkit scrollbar hiding on component mount
  React.useEffect(() => {
    addWebkitScrollbarHide();
  }, []);
  
  return (
    <div className="flex flex-col gap-[6.5rem] pb-16">
      {/* Header - Fixed content with proper spacing for sidebar */}
      <header className="flex justify-between items-center pl-40 pr-4">
        <div className="w-full flex flex-col gap-12">
          <h1 className="text-8xl font-bold">J.O.E</h1>
          <p className="text-xl text-[rgba(255,255,255,0.6)]">
            Welcome to the extraordinary world of {name} a versatile and
            imaginative artist who skillfully navigates the realms of product
            design, photography and digital art. With a keen eye for detail and
            a relentless pursuit of innovation, {name} crafts captivating visual
            narratives, immersive digital realms, and functional yet
            aesthetically pleasing products.
          </p>
        </div>
        <div className="w-full">d</div>
      </header>

      {/* Project sections */}
      {projectSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="relative">
          {/* Section title if it exists */}
          {section.title && (
            <div className="font-bold text-2xl text-start pl-40 pb-8">
              {section.title}
            </div>
          )}
          
          {/* Horizontal scroll container */}
          <div 
            className="flex gap-8 overflow-x-auto overflow-y-hidden pb-4 horizontal-scroll-container hide-scrollbar" 
            style={scrollbarHideStyle}
          >
            {/* Cards container - starts aligned with text but can scroll left behind sidebar */}
            <div className="flex gap-8 pl-40">
              {section.projects.map((project, projectIndex) => (
                <ProjectCard
                  key={projectIndex}
                  title={project.title}
                  subtitle={project.subtitle}
                  gradient={project.gradient}
                />
              ))}
              {/* Add padding at the end */}
              <div className="flex-shrink-0 w-4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeIndex; 