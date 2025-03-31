import { NextResponse } from "next/server";
import { sqlAgent } from "../../../mastra/agents/sql";
import { z } from "zod";

const agentResponseSchema = z.object({
  result: z.string(),
  sqlQuery: z.string(),
  tableData: z.object({
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  success: z.boolean().optional(),
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  try {
    const [
      {
        content: [{ text: query }],
      },
    ] = messages;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          error:
            "Invalid request. Please provide a natural language query as a string.",
        },
        { status: 400 }
      );
    }

    try {
      const { object } = await sqlAgent.generate(
        [
          {
            role: "user",
            content: query,
          },
        ],
        {
          experimental_output: agentResponseSchema,
        }
      );

      return NextResponse.json({
        ...object,
      });
    } catch (error) {
      console.error("Failed to get structured response from SQL agent:", error);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: `An error occurred while processing your query: ${errorMessage}`,
        success: false,
      },
      { status: 500 }
    );
  }
}
