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
    <div className="w-full space-y-4 p-4">
      <Grid rows="minmax(0, 1fr)" columns={{ sm: 1, md: 2, lg: 3 }} gap="md" h="500px" alignContent="stretch" className="w-full">
        <Profile />
        <FocusSpace />
        <WorkingAgreements />
      </Grid>

      <Grid rows="masonry" columns={{ sm: 1, lg: 2 }} gap="md" className="w-full" masonryColumnFill="balance">
        <Activity />
        <StudioRhythm />
      </Grid>

      <Grid rows="masonry" columns={{ sm: 1, lg: 2 }} gap="md" className="w-full" masonryColumnFill="balance">
        <ProjectSpace />
        <PracticeLibrary />
      </Grid>
    </div>
  );
}
