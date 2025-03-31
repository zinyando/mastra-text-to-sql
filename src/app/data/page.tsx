"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type TableData = {
  headers: string[];
  rows: string[][];
};

export default function DataPage() {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/data");
        const data = await response.json();

        if (data.success) {
          setTableData(data.tableData);
          setError(null);
        } else {
          setError(data.error || "Failed to fetch data");
          setTableData(null);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred while fetching data");
        setTableData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatHeaderName = (header: string) => {
    return header
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatNumber = (value: string) => {
    const num = Number(value.replace(/,/g, ""));
    if (isNaN(num)) return value;

    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Header with subtle border */}
      <header className="relative py-8 mb-8 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 dark:text-white">
            City Population Database
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            Complete database of city population information
          </p>
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to Chat
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-7xl pb-16">
        <section>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent dark:border-blue-400 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Loading database...
                </p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                  <svg
                    className="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
                  Error
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{error}</p>
              </div>
            ) : tableData && tableData.headers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      {tableData.headers.map((header, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                        >
                          {formatHeaderName(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {tableData.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={
                          rowIndex % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-700"
                        }
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                          >
                            {!isNaN(Number(cell.replace(/,/g, ""))) ? (
                              <span
                                className={`font-medium ${cellIndex === 1 ? "text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"}`}
                              >
                                {formatNumber(cell)}
                              </span>
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  No data available
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
