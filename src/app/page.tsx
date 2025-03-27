// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Assistant } from './assistant';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('/api/data');
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch data');
    //     }
    //     const result = await response.json();
    //     setData(result);
    //   } catch (err) {
    //     setError('Failed to load data');
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchData();
  }, []);

  const formatHeaderName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen p-4">
      <div className="flex w-full max-w-7xl gap-6">
        {/* Assistant Column */}
        <div className="flex-1 min-w-[500px]">
          <Assistant />
        </div>
        
        {/* Results Column */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">City Population Data</h2>
          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
          ) : error ? (
            <p className="text-red-600 dark:text-red-400">{error}</p>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    {data.length > 0 &&
                      Object.keys(data[0]).map((header) => (
                        <th 
                          key={header} 
                          className="p-3 text-left font-semibold border-b border-gray-200 dark:border-gray-600"
                        >
                          {formatHeaderName(header)}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr 
                      key={rowIndex}
                      className={`
                        hover:bg-gray-50 dark:hover:bg-gray-700
                        ${rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
                      `}
                    >
                      {Object.values(row).map((value: any, colIndex) => (
                        <td 
                          key={colIndex}
                          className="p-3 border-b border-gray-200 dark:border-gray-600"
                        >
                          {value?.toString() || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}