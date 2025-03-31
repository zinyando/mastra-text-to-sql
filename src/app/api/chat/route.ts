import { NextResponse } from "next/server";
import { sqlAgent } from "../../../mastra/agents/sql";

export const runtime = "nodejs";
export const maxDuration = 30;

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

    const stream = await sqlAgent.stream([
      {
        role: "user",
        content: query,
      },
    ]);

    const encoder = new TextEncoder();
    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();

    (async () => {
      try {
        const reader = stream.textStream;
        for await (const chunk of reader) {
          try {
            const formattedChunk = `data: ${JSON.stringify({ type: "text", value: chunk })}\n\n`;
            await writer.write(encoder.encode(formattedChunk));
          } catch (writeError) {
            console.log(
              "Write error (client likely disconnected):",
              writeError
            );
            break;
          }
        }

        try {
          await writer.write(encoder.encode("data: [DONE]\n\n"));
        } catch (closeError) {
          console.log("Error writing close event:", closeError);
        }
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message.includes("ResponseAborted")
        ) {
          console.log("Client disconnected:", error);
        } else {
          console.error("Stream processing error:", error);

          try {
            await writer.write(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", value: error instanceof Error ? error.message : String(error) })}\n\n`
              )
            );
          } catch (writeError) {
            console.log("Error writing error message:", writeError);
          }
        }
      } finally {
        try {
          if (writer.desiredSize !== null) {
            await writer.close();
          }
        } catch (e) {
          console.log("Error closing writer:", e);
        }
      }
    })();

    return new Response(responseStream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
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
