#!/usr/bin/env node

import { runActions } from "../../../scripts/actions.mjs";

runActions({ packageRoot: new URL("..", import.meta.url).pathname });
