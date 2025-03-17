import { Mastra } from "@mastra/core";

import { sqlAgent } from "./agents/sql";

export const mastra = new Mastra({
  agents: { sqlAgent },
});
