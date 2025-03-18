import { NextResponse } from "next/server";
import { sqlAgent } from "../../../mastra/agents/sql";
import { z } from "zod";

const schema = z.object({
  result: z.string(),
  sqlQuery: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          error:
            "Invalid request. Please provide a natural language query as a string.",
        },
        { status: 400 }
      );
    }

    const response = await sqlAgent.generate(
      [
        {
          role: "user",
          content: query,
        },
      ],
      {
        output: schema,
      }
    );

    const sqlQueryMatch = response.object.sqlQuery.match(/SELECT[\s\S]*?;/i);
    const sqlQuery = sqlQueryMatch ? sqlQueryMatch[0] : null;

    return NextResponse.json({
      result: response.object.result,
      sqlQuery,
      success: true,
    });
  } catch (error) {
    console.error("Error processing query:", error);
    return NextResponse.json(
      {
        error: `An error occurred while processing your query: ${error instanceof Error ? error.message : String(error)}`,
        success: false,
      },
      { status: 500 }
    );
  }
}
