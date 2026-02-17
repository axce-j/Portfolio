import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Mail,
  Settings,
  Linkedin,
  Github,
  Star,
  Folder,
  Sparkles,
  Files,
  PersonStanding,
  User2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
interface SidebarLayoutProps {
  children: ReactNode;
}
const navigationItems = [
  { icon: Home, path: "/", label: "Home" },
  { icon: Folder, path: "/projects", label: "Projects" },
  { icon: User2, path: "/career", label: "Career" },
  { icon: Sparkles, path: "/expertise", label: "Expertise" },
];
const contactItems = [{ icon: Mail, path: "/contacts", label: "Contact" },
  { icon: Settings, path: "/settings", label: "settings" },

];
const specialItems = [{ icon: Star, path: "/favorites", label: "Favorites" }];
const socialItems = [
  {
    icon: Linkedin,
    href: "https://ng.linkedin.com/in/obinna-jachike-ezeani-a072b9284?trk=people-guest_people_search-card",
    label: "LinkedIn",
  },
  { icon: Github, href: "https://github.com/axce-j", label: "GitHub" },
];
export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHorizontalScrolled, setIsHorizontalScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    // Function to handle horizontal scroll detection
    const handleHorizontalScroll = () => {
      const scrollContainers = document.querySelectorAll(
        ".horizontal-scroll-container"
      );
      let anyScrolled = false;

      scrollContainers.forEach((container) => {
        if (container.scrollLeft > 0) {
          anyScrolled = true;
        }
      });

      setIsHorizontalScrolled(anyScrolled);
    };

    // Add scroll listeners
    window.addEventListener("scroll", handleScroll);

    // Add horizontal scroll listeners to all horizontal scroll containers
    const scrollContainers = document.querySelectorAll(
      ".horizontal-scroll-container"
    );
    scrollContainers.forEach((container) => {
      container.addEventListener("scroll", handleHorizontalScroll);
    });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      scrollContainers.forEach((container) => {
        container.removeEventListener("scroll", handleHorizontalScroll);
      });
    };
  }, []);

  // const projectSections = [
  //   {
  //     title: "Design Projects",
  //     projects: [
  //       { type:"D1", title: "Logo Design", subtitle: "Creative logos and branding", gradient: "blue" },
  //       { type:"D2", title: "UI Mockups", subtitle: "High-fidelity interface designs", gradient: "teal" },
  //       { type:"D3", title: "Poster Design", subtitle: "Event and promotional posters", gradient: "yellow" },
  //       { type:"D4", title: "Photography", subtitle: "Landscape & portrait photography", gradient: "mixed" },
  //       { type:"D5", title: "Digital Illustration", subtitle: "Custom digital artworks", gradient: "blue" }
  //     ]
  //   },
  //   {
  //     title: "Back-End Projects",
  //     projects: [
  //       { type:"B.E.P1", title: "API Development", subtitle: "RESTful and GraphQL APIs", gradient: "teal" },
  //       { type:"B.E.P2", title: "Database Design", subtitle: "Schema and optimization work", gradient: "yellow" },
  //       { type:"B.E.P3", title: "E-commerce Platform", subtitle: "Back-end for online stores", gradient: "blue" },
  //       { type:"B.E.P4", title: "Authentication Systems", subtitle: "Secure login & user management", gradient: "mixed" }
  //     ]
  //   },
  //   {
  //     title: "Front-End Projects",
  //     projects: [
  //       { type:"F.E.P1", title: "Portfolio Website", subtitle: "Personal showcase site", gradient: "teal" },
  //       { type:"F.E.P2", title: "Dashboard UI", subtitle: "Interactive data dashboards", gradient: "blue" },
  //       { type:"F.E.P3", title: "Landing Pages", subtitle: "Marketing & product pages", gradient: "yellow" },
  //       { type:"F.E.P4", title: "Mobile UI Design", subtitle: "Cross-platform app interfaces", gradient: "mixed" }
  //     ]
  //   }
  // ];
  return (
    <div className="min-h-screen bg-primary">
      {/* Left Sidebar - Fixed with proper z-index management */}
      <aside
        className={cn(
          "fixed w-36 h-full pt-[3.2rem] flex flex-col items-center py-4 space-y-4 transition-all duration-300",
          // Always keep sidebar above content, but allow cards to show behind it
          "z-40"
        )}
      >
        <div
          className={cn(
            "w-16 flex flex-col justify-center items-center border pt-2 pb-2 rounded-[70px] transition-all duration-300",
            isHorizontalScrolled
              ? "shadow-[inset_0_1px_2px_rgba(255,255,255,0.02),inset_0_-1px_2px_rgba(0,0,0,0.4),0_4px_20px_rgba(0,0,0,0.6)] bg-black/20 backdrop-blur-3xl border-gray-600/10"
              : isScrolled
              ? "shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.3),0_4px_20px_rgba(0,0,0,0.4)] bg-gray-800/20 backdrop-blur-xl border-gray-600/20"
              : "shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.3)] bg-[linear-gradient(to-b,white,rgba(0,0,0,0.1))] border-gray-700/30"
          )}
        >
          {/* Navigation Items */}
          <div className="flex flex-col space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path} className="relative group">
                  <Button
                    asChild
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "w-8 h-8 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Link to={item.path}>
                      <Icon className="w-4 h-4" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </Button>
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-8 h-px bg-border my-3" />
          <div>
            {contactItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path} className="relative group">
                  <Button
                    asChild
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "w-8 h-8 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Link to={item.path}>
                      <Icon className="w-4 h-4" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </Button>
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex-1" />
          {/* <div className="relative group">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Settings className="w-4 h-4" />
              <span className="sr-only">Settings</span>
            </Button>
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Settings
            </div>
          </div> */}
        </div>
      </aside>

      {/* Fixed Top Welcome Bar with fade animation */}
      <nav className="fixed top-0 left-0 w-full flex justify-center  py-6 transition-all duration-300 z-30">
        <div
          className={cn(
            "flex items-center justify-center px-6 py-3 rounded-[70px] transition-all duration-300",
            isHorizontalScrolled
              ? "shadow-[inset_0_1px_2px_rgba(255,255,255,0.02),inset_0_-1px_2px_rgba(0,0,0,0.4),0_4px_20px_rgba(0,0,0,0.6)] bg-black/20 backdrop-blur-3xl border border-gray-600/10"
              : isScrolled
              ? "shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.3),0_4px_20px_rgba(0,0,0,0.4)] bg-gray-800/20 backdrop-blur-xl border border-gray-600/20"
              : "shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.3)] bg-[linear-gradient(to-b,white,rgba(0,0,0,0.1))] border border-gray-700/30"
          )}
        >
          <h1
            className="text-sm font-medium select-none 
             bg-gradient-to-r from-green-900 via-teal-500 to-cyan-400 
             bg-clip-text text-transparent 
             animate-fade"
          >
            Welcome to my page
          </h1>
          <style>{`
  @keyframes fade {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
  .animate-fade {
    animation: fade 3s ease-in-out infinite;
  }
`}</style>
        </div>
      </nav>

      {/* New: Right horizontal fixed duplicate of the aside, aligned near the navbar */}
      <div className="fixed right-8 top-6 z-40 pointer-events-auto">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-[70px] transition-all duration-300",
            isHorizontalScrolled
              ? "shadow-[inset_0_1px_2px_rgba(255,255,255,0.02),inset_0_-1px_2px_rgba(0,0,0,0.4),0_4px_20px_rgba(0,0,0,0.6)] bg-black/20 backdrop-blur-3xl border border-gray-600/10"
              : isScrolled
              ? "shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.3),0_4px_20px_rgba(0,0,0,0.4)] bg-gray-800/20 backdrop-blur-xl border border-gray-600/20"
              : "shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.3)] bg-[linear-gradient(to-b,white,rgba(0,0,0,0.1))] border border-gray-700/30"
          )}
        >
          {/* horizontal nav items */}
          <div className="flex items-center gap-2">
            {specialItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path} className="relative group">
                  <Button
                    asChild
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "w-8 h-8 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Link to={item.path}>
                      <Icon className="w-4 h-4" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </Button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                </div>
              );
            })}
            {socialItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative group">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="sr-only">{item.label}</span>
                    </a>
                  </Button>
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Allow content to flow under both sidebar and navbar */}
      <main className="relative pt-24">
        <div className="">{children}</div>
      </main>
    </div>
  );
}
