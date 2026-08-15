import { Routes, Route, Outlet } from "react-router-dom";
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
import AdminUploadPage from "./features/admin/AdminUploadPage";
import { ADMIN_ROUTE } from "./config/adminAccess";
import { useSecretTypedPhrase } from "./features/admin/hooks/useSecretTypedPhrase";

// Wraps only the public-facing pages in the sidebar/nav chrome.
// Anything NOT nested under this layout route (like the admin page
// below) renders bare — no fixed sidebar, no top nav, no pt-24
// padding fighting its own layout.
function PublicLayout() {
	return (
		<SidebarLayout>
			<Outlet />
		</SidebarLayout>
	);
}

function App() {
	// Global listener for the hidden-admin typed phrase. Must be called
	// here, inside the component body before the return.
	useSecretTypedPhrase();

	return (
		<Routes>
			{/* Admin page — deliberately OUTSIDE PublicLayout, so it gets
			    a clean full-screen canvas with none of the site chrome. */}
			<Route path={ADMIN_ROUTE} element={<AdminUploadPage />} />

			{/* Everything else — wrapped in the sidebar/nav layout */}
			<Route element={<PublicLayout />}>
				<Route path="/" element={<IndexFile />} />
				<Route path="/projects" element={<ProjectsPage />}>
					<Route index element={<ProjectIndex />} />
					<Route
						path="single-project/:id"
						element={<SingleProjectPage />}
					/>
				</Route>
				<Route path="/expertise" element={<Expertise />} />
				<Route path="/career" element={<Career />} />
				<Route path="/chronicle" element={<Chronicle />} />
				<Route path="/contacts" element={<ContactsPage />} />
				<Route path="/settings" element={<Settings />} />
			</Route>
		</Routes>
	);
}

export default App;