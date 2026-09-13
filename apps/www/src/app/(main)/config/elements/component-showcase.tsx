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
  // Base masonry row unit in pixels. Every tile spans a whole number of these
  // rows so the packed layout is deterministic at server render — no JS
  // measurement, no first-load shift. A tile spanning `rows` is
  // `rows * rowUnit + (rows - 1) * tileGap` pixels tall.
  rowUnit: 32,
} as const;

// `rows` is the tile's fixed height expressed in `showcaseLayout.rowUnit` tracks,
// chosen to fit each preview's natural content. `wide` spans two columns. Cards
// stretch to fill their cell, so any slack reads as padding and any overflow is
// clipped by the card rather than overlapping neighbours.
export const previewExamples: {
  id: string;
  component: ComponentType;
  rows: number;
  wide?: boolean;
}[] = [
  { id: "revenue", component: Revenue, rows: 10, wide: true },
  { id: "booking", component: Booking, rows: 12 },
  { id: "music", component: Music, rows: 9 },
  { id: "tasks", component: Tasks, rows: 7 },
  { id: "payments", component: Payments, rows: 10, wide: true },
  { id: "notifications", component: Notifications, rows: 9 },
  { id: "messages", component: Messages, rows: 8 },
  { id: "team", component: Team, rows: 6, wide: true },
  { id: "plan", component: Plan, rows: 8 },
  { id: "traffic", component: Traffic, rows: 7 },
  { id: "developer", component: Developer, rows: 7, wide: true },
  { id: "storage", component: Storage, rows: 5 },
  { id: "feedback", component: Feedback, rows: 7 },
  { id: "files", component: Files, rows: 6 },
  { id: "delivery", component: Delivery, rows: 10 },
  { id: "states", component: DataStates, rows: 7 },
  { id: "project-launcher", component: ProjectLauncher, rows: 11 },
  { id: "integrations-workspace", component: IntegrationsWorkspace, rows: 9, wide: true },
  { id: "email-workspace", component: EmailWorkspace, rows: 10, wide: true },
  { id: "appearance-editor", component: AppearanceEditor, rows: 9 },
  { id: "deployment-activity", component: DeploymentActivity, rows: 9 },
];
