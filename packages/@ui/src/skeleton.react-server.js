import React from "react";
export * from "../dist/skeleton.es.js";
import { Skeleton as SkeletonRoot, SkeletonText, SkeletonImage } from "../dist/skeleton.es.js";

export const Skeleton = Object.assign(function Skeleton(props) {
  return React.createElement(SkeletonRoot, props);
}, { Text: SkeletonText, Image: SkeletonImage });
