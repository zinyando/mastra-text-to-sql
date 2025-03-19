import { NextResponse } from "next/server";
import { sqlAgent } from "../../../mastra/agents/sql";
import { populationInfo } from "../../../mastra/tools/population-info";
import { z } from "zod";

// Define a schema for the SQL generation
const sqlGenerationSchema = z.object({
  result: z.string().describe("Text explanation of the results"),
  sqlQuery: z.string().describe("The SQL query used to generate the results"),
});

// Define specific types for database query results
type SqlValue = string | number | boolean | null;
type SqlRow = Record<string, SqlValue>;
type SqlQueryResult = SqlRow[];

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

    // Step 1: Generate SQL query from natural language
    const agentResponse = await sqlAgent.generate(
      [
        {
          role: "user",
          content: `${query}\n\nPlease generate a SQL query to answer this question. Only return the SQL query and a brief explanation.`,
        },
      ],
      {
        output: sqlGenerationSchema,
      }
    );

    // Extract the SQL query
    const sqlQueryMatch = agentResponse.object.sqlQuery.match(/SELECT[\s\S]*?;/i);
    const sqlQuery = sqlQueryMatch ? sqlQueryMatch[0] : null;
    
    if (!sqlQuery) {
      return NextResponse.json({
        error: "Failed to generate a valid SQL query",
        success: false,
      }, { status: 500 });
    }
    


    // Step 2: Execute the SQL query directly
    try {
      // Type assertion to handle the execute method
      const executeMethod = populationInfo.execute as (
        params: { context: { query: string } }
      ) => Promise<SqlQueryResult>;
      
      const queryResults: SqlQueryResult = await executeMethod({ context: { query: sqlQuery } });

      
      // Step 3: Format the results into a table
      if (Array.isArray(queryResults) && queryResults.length > 0) {
        // Extract headers from the first result object
        const headers = Object.keys(queryResults[0] as SqlRow);
        
        // Extract rows from all results
        const rows = queryResults.map((row: SqlRow) => {
          return headers.map(header => {
            const value = row[header];
            
            // Format the value based on its type
            if (value === null) {
              return "N/A";
            } else if (typeof value === 'number') {
              return new Intl.NumberFormat().format(value);
            } else {
              return String(value);
            }
          });
        });
        
        // Create the table data structure
        const tableData = {
          headers,
          rows
        };
        
        // Return the complete response
        return NextResponse.json({
          result: agentResponse.object.result,
          sqlQuery,
          tableData,
          success: true,
        });
      } else {
        // Handle empty results
        return NextResponse.json({
          result: "The query returned no results.",
          sqlQuery,
          tableData: { headers: [], rows: [] },
          success: true,
        });
      }
    } catch (queryError) {

      return NextResponse.json({
        error: `Error executing SQL query: ${queryError instanceof Error ? queryError.message : String(queryError)}`,
        sqlQuery,
        success: false,
      }, { status: 500 });
    }
  } catch (error) {

    return NextResponse.json(
      {
        error: `An error occurred while processing your query: ${error instanceof Error ? error.message : String(error)}`,
        success: false,
      },
      { status: 500 }
    );
  }
}
