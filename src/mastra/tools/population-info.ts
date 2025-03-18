import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Client } from "pg";

const executeQuery = async (query: string) => {
  const client = new Client();
  try {
    await client.connect();
    console.log("Executing query:", query);
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw new Error(
      `Failed to execute query: ${error instanceof Error ? error.message : String(error)}`
    );
  } finally {
    await client.end();
  }
};

export const populationInfo = createTool({
  id: "Execute SQL Query",
  inputSchema: z.object({
    query: z
      .string()
      .describe("SQL query to execute against the cities database"),
  }),
  description: `Executes a SQL query against the cities database and returns the results`,
  execute: async ({ context: { query } }) => {
    console.log("Executing SQL query:", query);
    try {
      // Validate that this is a SELECT query for safety
      const trimmedQuery = query.trim().toLowerCase();
      if (!trimmedQuery.startsWith("select")) {
        throw new Error("Only SELECT queries are allowed for security reasons");
      }

      return await executeQuery(query);
    } catch (error) {
      console.error("Error executing SQL query:", error);
      throw new Error(
        `Failed to execute SQL query: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
});
