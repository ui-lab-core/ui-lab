import type { ComponentType } from "react";
import Revenue from "./component-showcase/previews/01-revenue";
import Booking from "./component-showcase/previews/02-booking";
import Music from "./component-showcase/previews/03-music";
import Tasks from "./component-showcase/previews/04-tasks";
import Payments from "./component-showcase/previews/05-payments";
import Notifications from "./component-showcase/previews/06-notifications";
import Messages from "./component-showcase/previews/07-messages";
import Team from "./component-showcase/previews/08-team";
import Plan from "./component-showcase/previews/09-plan";
import Traffic from "./component-showcase/previews/10-traffic";
import Developer from "./component-showcase/previews/11-developer";
import Storage from "./component-showcase/previews/12-storage";
import Feedback from "./component-showcase/previews/13-feedback";
import Files from "./component-showcase/previews/14-files";
import Delivery from "./component-showcase/previews/15-delivery";
import DataStates from "./component-showcase/previews/16-data-states";
import ProjectLauncher from "./component-showcase/previews/17-project-launcher";
import IntegrationsWorkspace from "./component-showcase/previews/18-integrations-workspace";
import EmailWorkspace from "./component-showcase/previews/19-email-workspace";
import AppearanceEditor from "./component-showcase/previews/20-appearance-editor";
import DeploymentActivity from "./component-showcase/previews/21-deployment-activity";

export const showcaseLayout = {
  masonry: true,
  gridGap: "none",
  tileGap: 16,
} as const;

export const previewExamples: { id: string; component: ComponentType; wide?: boolean }[] = [
  { id: "revenue", component: Revenue, wide: true },
  { id: "booking", component: Booking },
  { id: "music", component: Music },
  { id: "tasks", component: Tasks },
  { id: "payments", component: Payments, wide: true },
  { id: "notifications", component: Notifications },
  { id: "messages", component: Messages },
  { id: "team", component: Team, wide: true },
  { id: "plan", component: Plan },
  { id: "traffic", component: Traffic },
  { id: "developer", component: Developer, wide: true },
  { id: "storage", component: Storage },
  { id: "feedback", component: Feedback },
  { id: "files", component: Files },
  { id: "delivery", component: Delivery },
  { id: "states", component: DataStates },
  { id: "project-launcher", component: ProjectLauncher },
  { id: "integrations-workspace", component: IntegrationsWorkspace, wide: true },
  { id: "email-workspace", component: EmailWorkspace, wide: true },
  { id: "appearance-editor", component: AppearanceEditor },
  { id: "deployment-activity", component: DeploymentActivity },
];
