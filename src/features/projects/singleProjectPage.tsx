import { cn } from "@/lib/utils";

 
 
 // Types for content structure
 interface Project {
   id: string;
   title: string;
   description?: string;
   image?: string;
   content?: string;
   type: 'featured' | 'card' | 'media';
   bgColor?: string;
   textColor?: string;
 }
 
 interface Section {
   id: string;
   title: string;
   subtitle?: string;
   description?: string;
   content?: string;
   image?: string;
   layout: 'intro' | 'media' | 'text-image' | 'conclusion';
   bgGradient?: string;
 }
 
 interface HomePageData {
   intro: {
     title: string;
     description: string;
     tags: string[];
   };
   projects: Project[];
   sections: Section[];
   conclusion: {
     title: string;
     subtitle: string;
     description: string;
     author: string;
   };
 }
 
 // Sample data - this would typically come from props or API
 const homeData: HomePageData = {
   intro: {
     title: "Design projects",
     description: "Design is about more than making things look good. It's also about making them work well. Here, you'll find a selection of past design projects, each focused on different aspects of user experience, visual design, branding, or product strategy. From early concepts through to final execution, these projects showcase my approach to creating meaningful digital experiences.",
     tags: ["Project 1", "Project 2", "Project 3"]
   },
   projects: [
     {
       id: "project-featured",
       title: "Project 2",
       type: "featured",
       bgColor: "bg-blue-600",
       textColor: "text-white"
     },
     {
       id: "project-card",
       title: "Project title",
       description: "and some additional information",
       type: "card",
       content: "Explain what your project is about, what kind of problems does it solve, who is the target group, what is the business case, in what market does it make its presence.",
       image: "/api/placeholder/300/400"
 
     }
   ],
   sections: [
     {
       id: "section-1",
       title: "Section title:",
       subtitle: "And a subtitle",
       description: "Explain an important feature of the project and show some image variations to showcase your creative process in a preview.",
       layout: "media",
       image: "/api/placeholder/800/500"
     },
     {
       id: "section-2", 
       title: "Section title:",
       subtitle: "And a subtitle",
       content: "Explain an important feature of the project and show some image variations to showcase your creative process in a preview.",
       layout: "text-image",
       bgGradient: "from-purple-900/20 to-blue-900/20"
     }
   ],
   conclusion: {
     title: "Takeaway:",
     subtitle: "And a subtitle",
     description: "Write about what you've learned during this project, what are the main takeaways and how you are developing as you step into practice.",
     author: "Designed by you for Codeivl"
   }
 };
 
 // Reusable Components
 const IntroSection = ({ data }: { data: HomePageData['intro'] }) => (
   <section className="px-8 py-12 max-w-2xl">
     <h1 className="text-4xl font-light text-white mb-6">{data.title}</h1>
     <p className="text-gray-300 leading-relaxed mb-8 text-sm">
       {data.description}
     </p>
     <div className="flex gap-3">
       {data.tags.map((tag, index) => (
         <span
           key={index}
           className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
         >
           {tag}
         </span>
       ))}
     </div>
   </section>
 );
 
 const ProjectCard = ({ project }: { project: Project }) => {
   if (project.type === 'featured') {
     return (
       <div className={cn(
         "rounded-2xl p-12 flex items-center justify-center h-80 mb-16",
         project.bgColor
       )}>
         <h2 className={cn("text-4xl font-bold", project.textColor)}>
           {project.title}
         </h2>
       </div>
     );
   }
 
   if (project.type === 'card') {
     return (
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
         <div className="bg-gray-800 rounded-2xl aspect-[4/5]">
           {project.image && (
             <div className="w-full h-full bg-gray-700 rounded-2xl"></div>
           )}
         </div>
         <div className="flex flex-col justify-center space-y-6">
           <h3 className="text-2xl text-white">
             {project.title} <span className="text-gray-400">{project.description}</span>
           </h3>
           <p className="text-gray-300 text-sm leading-relaxed">
             {project.content}
           </p>
         </div>
       </div>
     );
   }
 
   return null;
 };
 
 const ContentSection = ({ section }: { section: Section }) => {
   if (section.layout === 'media') {
     return (
       <section className="text-center py-16 mb-16">
         <h2 className="text-2xl text-white mb-2">
           {section.title}
         </h2>
         <h3 className="text-xl text-gray-400 mb-6">{section.subtitle}</h3>
         <p className="text-gray-300 text-sm mb-12 max-w-2xl mx-auto">
           {section.description}
         </p>
         <div className="rounded-2xl overflow-hidden bg-gray-800 max-w-4xl mx-auto">
           <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center">
             <div className="w-80 h-96 bg-gray-700/50 rounded-lg"></div>
           </div>
         </div>
       </section>
     );
   }
 
   if (section.layout === 'text-image') {
     return (
       <section className={cn(
         "rounded-2xl p-12 mb-16 bg-gradient-to-br",
         section.bgGradient || "from-gray-800 to-gray-900"
       )}>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div>
             <h2 className="text-2xl text-white mb-2">{section.title}</h2>
             <h3 className="text-xl text-gray-400 mb-6">{section.subtitle}</h3>
             <p className="text-gray-300 text-sm leading-relaxed">
               {section.content}
             </p>
           </div>
           <div className="bg-gray-700/30 rounded-xl aspect-[4/3]"></div>
         </div>
       </section>
     );
   }
 
   return null;
 };
 
 const ConclusionSection = ({ data }: { data: HomePageData['conclusion'] }) => (
   <section className="text-center py-16">
     <h2 className="text-2xl text-white mb-2">{data.title}</h2>
     <h3 className="text-xl text-gray-400 mb-8">{data.subtitle}</h3>
     <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mx-auto mb-12">
       {data.description}
     </p>
     <p className="text-gray-500 text-xs">{data.author}</p>
   </section>
 );
 
 // Main HomePage Component
 export default function SingleProjectPage({ data = homeData }: { data?: HomePageData }) {
   return (
     <div className="min-h-screen bg-gray-900 text-white">
       <div className="horizontal-scroll-container overflow-x-auto">
         <div className="min-w-full px-4 lg:px-8">
           {/* Intro Section */}
           <IntroSection data={data.intro} />
 
           {/* Projects Section */}
           <div className="max-w-6xl mx-auto px-4">
             {data.projects.map((project) => (
               <ProjectCard key={project.id} project={project} />
             ))}
           </div>
 
           {/* Content Sections */}
           <div className="max-w-6xl mx-auto px-4">
             {data.sections.map((section) => (
               <ContentSection key={section.id} section={section} />
             ))}
           </div>
 
           {/* Conclusion */}
           <div className="max-w-6xl mx-auto px-4">
             <ConclusionSection data={data.conclusion} />
           </div>
         </div>
       </div>
     </div>
   );
 }