// // import { ReactNode } from 'react'
// import { Link, useLocation } from "react-router-dom";
// // import { Button } from "@/components/ui/button"
// // import { cn } from "@/lib/utils"
// import {
//   Home,
//   FolderOpen,
//   FileText,
//   Mail,
//   Settings,
//   Linkedin,
//   Github,
// } from "lucide-react";
// import type { ReactNode } from "react";
// import { Button } from "../components/ui/button";
// import { cn } from "../lib/utils";

// interface SidebarLayoutProps {
//   children: ReactNode;
// }

// const navigationItems = [
//   {
//     icon: Home,
//     path: "/",
//     label: "Home",
//   },
//   {
//     icon: FolderOpen,
//     path: "/projects",
//     label: "Projects",
//   },
//   {
//     icon: FileText,
//     path: "/resume",
//     label: "Resume",
//   },
//   {
//     icon: Mail,
//     path: "/contacts",
//     label: "Contact",
//   },
// ];

// const socialItems = [
//   {
//     icon: Linkedin,
//     href: "https://linkedin.com/in/yourprofile",
//     label: "LinkedIn",
//   },
//   {
//     icon: Github,
//     href: "https://github.com/yourprofile",
//     label: "GitHub",
//   },
// ];

// export default function SidebarLayout({ children }: SidebarLayoutProps) {
//   const location = useLocation();

//   return (
//     <div className="flex min-h-screen gap-8 bg-primary">
//       {/* Sidebar */}
//       <aside className=" fixed w-36 h-full pt-[3.2rem]   flex flex-col items-center  py-4 space-y-4">

//       <div className="w-16 flex flex-col justify-center items-center border border-gray-700/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.3)] bg-[linear-gradient(to-b,white,rgba(0,0,0,0.1))] pt-2 pb-2 rounded-[70px]">

//         {/* Navigation Items */}
//         <div className="flex flex-col space-y-2">
//           {navigationItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;

//             return (
//               <div key={item.path} className="relative group">
//                 <Button
//                   asChild
//                   variant={isActive ? "default" : "ghost"}
//                   size="icon"
//                   className={cn(
//                     "w-8 h-8 rounded-lg transition-colors",
//                     isActive
//                       ? "bg-primary text-primary-foreground"
//                       : "text-muted-foreground hover:text-foreground hover:bg-accent"
//                   )}
//                 >
//                   <Link to={item.path}>
//                     <Icon className="w-4 h-4" />
//                     <span className="sr-only">{item.label}</span>
//                   </Link>
//                 </Button>

//                 {/* Tooltip */}
//                 <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
//                   {item.label}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Divider */}
//         <div className="w-8 h-px bg-border my-4" />

//         {/* Settings */}
//         <div className="relative group">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
//           >
//             <Settings className="w-4 h-4" />
//             <span className="sr-only">Settings</span>
//           </Button>

//           <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
//             Settings
//           </div>
//         </div>

//         {/* Spacer to push social links to bottom */}
//         <div className="flex-1" />

//         {/* Social Links */}
//         <div className="flex flex-col space-y-2">
//           {socialItems.map((item, index) => {
//             const Icon = item.icon;

//             return (
//               <div key={index} className="relative group">
//                 <Button
//                   asChild
//                   variant="ghost"
//                   size="icon"
//                   className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
//                 >
//                   <a href={item.href} target="_blank" rel="noopener noreferrer">
//                     <Icon className="w-4 h-4" />
//                     <span className="sr-only">{item.label}</span>
//                   </a>
//                 </Button>

//                 <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
//                   {item.label}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//         </div>

//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 pt-[3.2rem] ml-36 overflow-auto">{children}</main>
//     </div>
//   );
// }

import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FolderOpen,
  FileText,
  Mail,
  Settings,
  Linkedin,
  Github,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

interface SidebarLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { icon: Home, path: "/", label: "Home" },
  { icon: FolderOpen, path: "/projects", label: "Projects" },
  { icon: FileText, path: "/resume", label: "Resume" },
  { icon: Mail, path: "/contacts", label: "Contact" },
];

const socialItems = [
  { icon: Linkedin, href: "https://linkedin.com/in/yourprofile", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/yourprofile", label: "GitHub" },
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
      const scrollContainers = document.querySelectorAll('.horizontal-scroll-container');
      let anyScrolled = false;
      
      scrollContainers.forEach(container => {
        if (container.scrollLeft > 0) {
          anyScrolled = true;
        }
      });
      
      setIsHorizontalScrolled(anyScrolled);
    };

    // Add scroll listeners
    window.addEventListener('scroll', handleScroll);
    
    // Add horizontal scroll listeners to all horizontal scroll containers
    const scrollContainers = document.querySelectorAll('.horizontal-scroll-container');
    scrollContainers.forEach(container => {
      container.addEventListener('scroll', handleHorizontalScroll);
    });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      scrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleHorizontalScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      {/* Sidebar - Fixed with proper z-index management */}
      <aside className={cn(
        "fixed w-36 h-full pt-[3.2rem] flex flex-col items-center py-4 space-y-4 transition-all duration-300",
        // Always keep sidebar above content, but allow cards to show behind it
        "z-40"
      )}>
        <div className={cn(
          "w-16 flex flex-col justify-center items-center border pt-2 pb-2 rounded-[70px] transition-all duration-300",
          isHorizontalScrolled
            ? "shadow-[inset_0_1px_2px_rgba(255,255,255,0.02),inset_0_-1px_2px_rgba(0,0,0,0.4),0_4px_20px_rgba(0,0,0,0.6)] bg-black/20 backdrop-blur-3xl border-gray-600/10"
            : isScrolled 
              ? "shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.3),0_4px_20px_rgba(0,0,0,0.4)] bg-gray-800/20 backdrop-blur-xl border-gray-600/20" 
              : "shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.3)] bg-[linear-gradient(to-b,white,rgba(0,0,0,0.1))] border-gray-700/30"
        )}>
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

          <div className="w-8 h-px bg-border my-4" />

          <div className="relative group">
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
          </div>

          <div className="flex-1" />

          <div className="flex flex-col space-y-2">
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
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
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
      </aside>

      {/* Main Content - Allow content to flow under sidebar */}
      <main className="relative">
        <div className="pt-[3.2rem]">
          {children}
        </div>
      </main>
    </div>
  );
}