import { Routes, Route } from "react-router-dom";
import SidebarLayout from "./layouts/sidebarLayout";
import IndexFile from "./pages";
import ResumePage from "./pages/resume";
import ProjectsPage from "./pages/projects";
import ContactsPage from "./pages/contacts";

function App() {
  return (
    <SidebarLayout>
      <Routes>
        {/* First route: Home */}
        <Route path="/" element={<IndexFile />} />

        {/* Example additional route */}
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
    </SidebarLayout>
  );
}

export default App;
