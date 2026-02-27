import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Mail,
  Settings,
  Linkedin,
  Github,
 
  Folder,
  Sparkles,
 
  User2,
  Scroll,
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
const specialItems = [{ icon: Scroll, path: "/chronicle", label: "Chronicle" }];
const socialItems = [
  {
    icon: Linkedin,
    href: "https://ng.linkedin.com/in/obinna-jachike-ezeani-a072b9284?trk=people-guest_people_search-card",
    label: "LinkedIn",
  },
  { icon: Github, href: "https://github.com/axce-j", label: "GitHub" },
];

// Mobile bottom bar shows ONLY the first 4 navigation items
const bottomNavItems = navigationItems;

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHorizontalScrolled, setIsHorizontalScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

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

    window.addEventListener("scroll", handleScroll);

    const scrollContainers = document.querySelectorAll(
      ".horizontal-scroll-container"
    );
    scrollContainers.forEach((container) => {
      container.addEventListener("scroll", handleHorizontalScroll);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      scrollContainers.forEach((container) => {
        container.removeEventListener("scroll", handleHorizontalScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-primary">

      {/* ── Left Sidebar — desktop/tablet only (md+) ── */}
      <aside
        className={cn(
          "hidden md:flex",
          "fixed w-36 h-full pt-[3.2rem] flex-col items-center py-4 space-y-4 transition-all duration-300",
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
        </div>
      </aside>

      {/* ── Fixed Top Welcome Bar ── */}
      <nav className="fixed top-0 left-0 w-full flex justify-center py-6 transition-all duration-300 z-30">
        <div
          className={cn(
            "flex items-center justify-center px-6 py-3 rounded-[70px] transition-all duration-300",
            "mx-4 md:mx-0",
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

      {/* ── Right floating bar (Chronicle + Socials) — desktop/tablet only (md+) ── */}
      <div className="hidden md:block fixed right-8 top-6 z-40 pointer-events-auto">
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

      {/* ── Main Content ── */}
      <main className="relative pt-24 pb-24 md:pb-0">
        <div className="">{children}</div>
      </main>

      {/* ── Mobile Bottom Navigation Bar — mobile only ── */}
      <nav
        className={cn(
          "md:hidden",
          "fixed bottom-0 left-0 w-full z-40",
          "pb-[env(safe-area-inset-bottom)]"
        )}
      >
        {/* Solid black outer wrapper — matches your site theme, no transparency */}
        <div className="w-full h-[70px] flex justify-center items-center bg-black">
          <div
            className={cn(
              "mx-4 w-[90vw] px-2 py-2 rounded-[70px] transition-all duration-300",
              isHorizontalScrolled
                ? "shadow-[inset_0_1px_2px_rgba(255,255,255,0.02),inset_0_-1px_2px_rgba(0,0,0,0.4),0_4px_20px_rgba(0,0,0,0.6)] bg-black/20 backdrop-blur-3xl border border-gray-600/10"
                : isScrolled
                ? "shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.3),0_4px_20px_rgba(0,0,0,0.4)] bg-gray-800/20 backdrop-blur-xl border border-gray-600/20"
                : "shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.3)] bg-[linear-gradient(to-b,white,rgba(0,0,0,0.1))] border border-gray-700/30"
            )}
          >
            {/* Only the first 4 nav items (navigationItems) */}
            <div className="flex items-center justify-around w-90vw">
              {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    asChild
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "w-9 h-9 rounded-xl transition-colors",
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
                );
              })}
            </div>
          </div>
        </div>
      </nav>

    </div>
  );
}