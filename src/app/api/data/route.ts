import { NextResponse } from "next/server";
import { Pool } from "pg";

type SqlValue = string | number | boolean | null;
type SqlRow = Record<string, SqlValue>;
type SqlQueryResult = SqlRow[];

const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export async function GET() {
  try {
    const sqlQuery = "SELECT * FROM cities ORDER BY population DESC;";

    try {
      const client = await pool.connect();

      try {
        const result = await client.query(sqlQuery);
        const queryResults: SqlQueryResult = result.rows;

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
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Database query error:", error);
      return NextResponse.json(
        {
          error: `Failed to execute SQL query: ${error instanceof Error ? error.message : String(error)}`,
          success: false,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
        success: false,
      },
      { status: 500 }
    );
  }
}
