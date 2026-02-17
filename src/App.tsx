import { Routes, Route } from "react-router-dom";
import SidebarLayout from "./layouts/sidebarLayout";
import IndexFile from "./pages";
import ResumePage from "./pages/expertise";
import ProjectsPage from "./pages/projects";
import ContactsPage from "./pages/contacts";
 
import ProjectIndex from "./features/projects";
import SingleProjectPage from "./features/projects/singleProjectPage";

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
        <Route path="/expertise" element={<ResumePage />} />
        <Route path="/Career" element={<ResumePage />} />
        <Route path="/favorites" element={<ResumePage />} />

        {/* Contacts */}
        <Route path="/contacts" element={<ContactsPage />} />

        <Route path="/settings" element={<ResumePage />} />
      </Routes>
    </SidebarLayout>
  );
}

export default App;
