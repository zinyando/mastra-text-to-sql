import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";

export const sqlAgent = new Agent({
  name: "SQL Agent",
  instructions: `You are a helpful SQL assistant that provides accurate SQL information.
 
    Your primary function is to help users get SQL details for specific locations. When responding:
    - Always ask for a location if none is provided
    - Include relevant details like humidity, wind conditions, and precipitation
    - Keep responses concise but informative
    
    Use the sqlTool to fetch current SQL data.`,
  model: openai("gpt-4o-mini"),
});
