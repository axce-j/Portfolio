import { Routes, Route } from "react-router-dom";
import SidebarLayout from "./layouts/sidebarLayout";
import IndexFile from "./pages";
 import ProjectsPage from "./pages/projects";
import ContactsPage from "./pages/contacts";
 
import ProjectIndex from "./features/projects";
import SingleProjectPage from "./features/projects/singleProjectPage";
import Career from "./pages/career";
import Expertise from "./pages/expertise";
 import Settings from "./pages/settings";
import Chronicle from "./pages/chronicle";

function App() {
  return (
    <SidebarLayout>
      <Routes>
        {/* Home */}
        <Route path="/" element={<IndexFile />} />

        {/* Projects with nested routes */}
        <Route path="/projects" element={<ProjectsPage />}>
        <Route index element={<ProjectIndex />} />
          <Route path="single-project/:id" element={<SingleProjectPage />} />
        
        </Route>

        {/* Resume */}
        <Route path="/expertise" element={<Expertise />} />
        <Route path="/Career" element={<Career />} />
        <Route path="/chronicle" element={<Chronicle />} />

        {/* Contacts */}
        <Route path="/contacts" element={<ContactsPage />} />

        <Route path="/settings" element={<Settings />} />
      </Routes>
    </SidebarLayout>
  );
}

export default App;
