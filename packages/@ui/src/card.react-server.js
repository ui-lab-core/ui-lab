import React from "react";
export * from "../dist/card.es.js";
import { Card as CardRoot, CardHeader, CardBody, CardFooter } from "../dist/card.es.js";

// Reassemble compound statics on the server side of the client-reference boundary.
export const Card = Object.assign(function Card(props) {
  return React.createElement(CardRoot, props);
}, { Header: CardHeader, Body: CardBody, Footer: CardFooter });
