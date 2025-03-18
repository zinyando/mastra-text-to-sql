import { NextResponse } from "next/server";
import { sqlAgent } from "../../../mastra/agents/sql";

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

    const response = await sqlAgent.generate([
      {
        role: "user",
        content: query,
      },
    ]);

    const sqlQueryMatch = response.text.match(/SELECT[\s\S]*?;/i);
    const sqlQuery = sqlQueryMatch ? sqlQueryMatch[0] : null;

    return NextResponse.json({
      result: response.text,
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
