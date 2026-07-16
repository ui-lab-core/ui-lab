import React from 'react';

export * from '../dist/ui-lab-ui.es.js';

import {
  Card as CardRoot,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton as SkeletonRoot,
  SkeletonImage,
  SkeletonText,
} from '../dist/ui-lab-ui.es.js';

const Card = Object.assign(function Card(props) {
  return React.createElement(CardRoot, props);
}, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

export { Card };

const Skeleton = Object.assign(function Skeleton(props) {
  return React.createElement(SkeletonRoot, props);
}, {
  Text: SkeletonText,
  Image: SkeletonImage,
});

export { Skeleton };
