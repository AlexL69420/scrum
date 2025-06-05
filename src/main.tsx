import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterForm from "./pages/RegisterPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ProjectPage from "./pages/ProjectPage.tsx";
import CreateProjectPage from "./pages/ProjectCreationPage.tsx";
import { TasksPage } from "./pages/TasksPage.tsx";
import { AnalyticsPage } from "./pages/AnalyticsPage.tsx";
import { MembersPage } from "./pages/MembersPage.tsx";
import { TeamsPage } from "./pages/TeamsPage.tsx";
import { SprintsPage } from "./pages/SprintPage.tsx";
import { SharePage } from "./pages/SharePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/auth",
    element: <LoginPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/project/:id",
    element: <ProjectPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/create-project",
    element: <CreateProjectPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/project/:id/taskboard/:sprintid",
    element: <TasksPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/project/:id/analytics",
    element: <AnalyticsPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/project/:id/members",
    element: <MembersPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/project/:id/teams",
    element: <TeamsPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/project/:id/sprints",
    element: <SprintsPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/share",
    element: <SharePage />,
    errorElement: <NotFoundPage />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
