"use client";

import dynamic from "next/dynamic";

const ShowcaseBefore = dynamic(() => import("./showcase-before").then((module) => module.ShowcaseBefore));
const ShowcaseAfter = dynamic(() => import("./showcase-after").then((module) => module.ShowcaseAfter));

export function TasteMockups({ showClean }: { showClean: boolean }) {
  return (
    <div className="relative grid h-full w-full place-items-center bg-background-900">
      <div className={`col-start-1 row-start-1 h-full w-full overflow-hidden transition-opacity duration-500 motion-reduce:transition-none ${showClean ? "opacity-0" : "opacity-100"}`}>
        <div className="h-[213%] w-[213%] origin-top-left scale-[0.47] md:h-full md:w-full md:scale-100">
          <ShowcaseBefore />
        </div>
      </div>
      {showClean ? (
        <div className="col-start-1 row-start-1 h-full w-full overflow-hidden opacity-100">
          <div className="h-[213%] w-[213%] origin-top-left scale-[0.47] md:h-full md:w-full md:scale-100">
            <ShowcaseAfter />
          </div>
        </div>
      ) : null}
    </div>
  );
}
