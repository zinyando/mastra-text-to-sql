import { NextResponse } from "next/server";
import { populationInfo } from "../../../mastra/tools/population-info";

type SqlValue = string | number | boolean | null;
type SqlRow = Record<string, SqlValue>;
type SqlQueryResult = SqlRow[];

export async function GET() {
  try {
    const sqlQuery = "SELECT * FROM cities ORDER BY population DESC;";

    try {
      const executeMethod = populationInfo.execute as (params: {
        context: { query: string };
      }) => Promise<SqlQueryResult>;

      const queryResults: SqlQueryResult = await executeMethod({
        context: { query: sqlQuery },
      });


      if (Array.isArray(queryResults) && queryResults.length > 0) {
        const allHeaders = Object.keys(queryResults[0] as SqlRow);
        const headers = allHeaders.filter(
          (header) => header.toLowerCase() !== "id"
        );

        const rows = queryResults.map((row: SqlRow) => {
          return headers.map((header) => {
            const value = row[header];

            if (value === null) {
              return "N/A";
            } else if (typeof value === "number") {
              return new Intl.NumberFormat().format(value);
            } else {
              return String(value);
            }
          });
        });

        const tableData = {
          headers,
          rows,
        };

        return NextResponse.json({
          tableData,
          success: true,
        });
      } else {
        return NextResponse.json(
          {
            error: "No data found in the database",
            success: false,
          },
          { status: 404 }
        );
      }
    } catch (error) {

      return NextResponse.json(
        {
          error: `Failed to execute SQL query: ${error instanceof Error ? error.message : String(error)}`,
          success: false,
        },
        { status: 500 }
      );
    }
  } catch (error) {

    return NextResponse.json(
      {
        error: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
        success: false,
      },
      { status: 500 }
    );
  }
}
