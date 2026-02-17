import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // <- MUST be imported here
import { ProjectProvider } from "./utils/projectStore";
import data from "./constants/data";

const { projectSections } = data();
ReactDOM.createRoot(document.getElementById("root")!).render(

  <React.StrictMode>
    <BrowserRouter>
    <ProjectProvider initialSections={projectSections}>
  <App />
</ProjectProvider>    </BrowserRouter>
  </React.StrictMode>
);
