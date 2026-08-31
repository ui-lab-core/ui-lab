"use client";

import { Grid } from "ui-lab-components";
import { Activity } from "./elements/01-activity";
import { StudioRhythm } from "./elements/02-studio-rhythm";
import { ProjectSpace } from "./elements/03-project-space";
import { Profile } from "./elements/04-profile";
import { PracticeLibrary } from "./elements/05-practice-library";
import { FocusSpace } from "./elements/06-focus-space";
import { WorkingAgreements } from "./elements/07-working-agreements";

export function PreviewCanvas() {
  return (
    <Grid
      columns={{ sm: 1, md: 2 }}
      rows="auto"
      gap="md"
      autoFlow="row-dense"
      className="w-full p-4"
    >
      <div className="min-w-0 md:col-span-2">
        <Activity />
      </div>
      <div className="min-w-0 md:col-span-2">
        <StudioRhythm />
      </div>
      <div className="min-w-0">
        <ProjectSpace />
      </div>
      <div className="min-w-0">
        <Profile />
      </div>
      <div className="min-w-0 md:col-span-2">
        <PracticeLibrary />
      </div>
      <div className="min-w-0">
        <FocusSpace />
      </div>
      <div className="min-w-0">
        <WorkingAgreements />
      </div>
    </Grid>
  );
}
