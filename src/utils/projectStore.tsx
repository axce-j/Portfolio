import  {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    useMemo,
    ReactNode,
  } from "react";
  
  // Types
  export type Project = {
    type: string;
    title: string;
    subtitle?: string;
    gradient?: string;
  };
  
  export type ProjectSection = {
    title: string;
    projects: Project[];
  };
  
  type State = {
    projectSections: ProjectSection[];
    activeProjectType: string | null;
    expandedSectionIndex: number | null;
  };
  
  type Action =
    | { type: "SET_PROJECT_SECTIONS"; payload: ProjectSection[] }
    | { type: "SET_ACTIVE_PROJECT"; payload: string | null }
    | { type: "TOGGLE_SECTION"; payload: number }
    | { type: "SET_EXPANDED_SECTION"; payload: number | null }
    | { type: "UPDATE_PROJECT"; payload: { sectionIndex: number; project: Project } }
    | { type: "ADD_PROJECT"; payload: { sectionIndex: number; project: Project } }
    | { type: "REMOVE_PROJECT"; payload: { sectionIndex: number; projectType: string } };
  
  const LOCALSTORAGE_KEY = "project_store_v1";
  
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "SET_PROJECT_SECTIONS":
        return { ...state, projectSections: action.payload };
      case "SET_ACTIVE_PROJECT":
        return { ...state, activeProjectType: action.payload };
      case "TOGGLE_SECTION": {
        const idx = action.payload;
        return { ...state, expandedSectionIndex: state.expandedSectionIndex === idx ? null : idx };
      }
      case "SET_EXPANDED_SECTION":
        return { ...state, expandedSectionIndex: action.payload };
      case "UPDATE_PROJECT": {
        const { sectionIndex, project } = action.payload;
        const sections = state.projectSections.map((s, i) => {
          if (i !== sectionIndex) return s;
          return {
            ...s,
            projects: s.projects.map((p) => (p.type === project.type ? project : p)),
          };
        });
        return { ...state, projectSections: sections };
      }
      case "ADD_PROJECT": {
        const { sectionIndex, project } = action.payload;
        const sections = state.projectSections.map((s, i) => {
          if (i !== sectionIndex) return s;
          return { ...s, projects: [project, ...s.projects] };
        });
        return { ...state, projectSections: sections };
      }
      case "REMOVE_PROJECT": {
        const { sectionIndex, projectType } = action.payload;
        const sections = state.projectSections.map((s, i) => {
          if (i !== sectionIndex) return s;
          return { ...s, projects: s.projects.filter((p) => p.type !== projectType) };
        });
        // if active project removed, clear it
        const activeRemoved = state.activeProjectType && !sections.some((sec) => sec.projects.some((p) => p.type === state.activeProjectType));
        return { ...state, projectSections: sections, activeProjectType: activeRemoved ? null : state.activeProjectType };
      }
      default:
        return state;
    }
  }
  
  const ProjectContext = createContext<{
    state: State;
    setProjectSections: (sections: ProjectSection[]) => void;
    setActiveProject: (type: string | null) => void;
    toggleSection: (index: number) => void;
    setExpandedSection: (index: number | null) => void;
    updateProject: (sectionIndex: number, project: Project) => void;
    addProject: (sectionIndex: number, project: Project) => void;
    removeProject: (sectionIndex: number, projectType: string) => void;
  } | null>(null);
  
  export function ProjectProvider({
    children,
    initialSections = [],
  }: {
    children: ReactNode;
    initialSections?: ProjectSection[];
  }) {
    // hydrate from localStorage if available
    const getInitialState = (): State => {
      try {
        const raw = localStorage.getItem(LOCALSTORAGE_KEY);
        if (raw) {
          return JSON.parse(raw) as State;
        }
      } catch (e) {
        // ignore parse errors
      }
  
      return {
        projectSections: initialSections,
        activeProjectType: null,
        expandedSectionIndex: null,
      };
    };
  
    const [state, dispatch] = useReducer(reducer, undefined as any, getInitialState);
  
    // persist to localStorage when state changes
    useEffect(() => {
      try {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        // ignore quota errors
      }
    }, [state]);
  
    const setProjectSections = useCallback((sections: ProjectSection[]) => dispatch({ type: "SET_PROJECT_SECTIONS", payload: sections }), []);
    const setActiveProject = useCallback((type: string | null) => dispatch({ type: "SET_ACTIVE_PROJECT", payload: type }), []);
    const toggleSection = useCallback((index: number) => dispatch({ type: "TOGGLE_SECTION", payload: index }), []);
    const setExpandedSection = useCallback((index: number | null) => dispatch({ type: "SET_EXPANDED_SECTION", payload: index }), []);
    const updateProject = useCallback((sectionIndex: number, project: Project) => dispatch({ type: "UPDATE_PROJECT", payload: { sectionIndex, project } }), []);
    const addProject = useCallback((sectionIndex: number, project: Project) => dispatch({ type: "ADD_PROJECT", payload: { sectionIndex, project } }), []);
    const removeProject = useCallback((sectionIndex: number, projectType: string) => dispatch({ type: "REMOVE_PROJECT", payload: { sectionIndex, projectType } }), []);
  
    const value = useMemo(() => ({
      state,
      setProjectSections,
      setActiveProject,
      toggleSection,
      setExpandedSection,
      updateProject,
      addProject,
      removeProject,
    }), [state, setProjectSections, setActiveProject, toggleSection, setExpandedSection, updateProject, addProject, removeProject]);
  
    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
  }
  
  export function useProjectStore() {
    const ctx = useContext(ProjectContext);
    if (!ctx) throw new Error("useProjectStore must be used within a ProjectProvider");
    return ctx;
  }
  
  // Utility: reorder projects so active project appears first for a specific section
  export function getOrderedProjectsForSection(section: ProjectSection, activeProjectType: string | null) {
    const list = [...section.projects];
    if (!activeProjectType) return list;
    const idx = list.findIndex((p) => p.type === activeProjectType);
    if (idx >= 0) {
      const [cur] = list.splice(idx, 1);
      return [cur, ...list];
    }
    return list;
  }
  