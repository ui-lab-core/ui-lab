import { Skeleton } from "ui-lab-components";

export function SkeletonAnimation() {
  return (
    <div
      data-skeleton-animate
      className="flex w-44 items-center gap-3"
      aria-hidden="true"
    >
      <Skeleton.Image w={58} h={58} className="shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <Skeleton w="72%" h={10} />
        <Skeleton.Text lines={2} scale={0.65} />
      </div>
    </div>
  );
}
