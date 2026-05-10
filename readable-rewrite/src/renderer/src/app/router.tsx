import { createHashRouter, Navigate } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { AutomationsPage } from "@/pages/AutomationsPage";
import { HomePage } from "@/pages/HomePage";
import { PluginsPage } from "@/pages/PluginsPage";
import { ScratchpadPage } from "@/pages/ScratchpadPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { SkillsPage } from "@/pages/SkillsPage";
import { ThreadPage } from "@/pages/ThreadPage";

export const router = createHashRouter([
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/settings/:sectionId",
    element: <SettingsPage />,
  },
  {
    path: "/",
    element: <Shell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "thread/:threadId",
        element: <ThreadPage />,
      },
      {
        path: "plugins",
        element: <PluginsPage />,
      },
      {
        path: "skills",
        element: <SkillsPage />,
      },
      {
        path: "automations",
        element: <AutomationsPage />,
      },
      {
        path: "scratchpad",
        element: <ScratchpadPage />,
      },
      {
        path: "settings",
        element: <Navigate replace to="/settings/general-settings" />,
      },
    ],
  },
]);
