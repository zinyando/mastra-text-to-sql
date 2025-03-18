"use client";

import { useState, useRef, useEffect } from "react";

type TableData = {
  headers: string[];
  rows: string[][];
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [activeTab, setActiveTab] = useState<'table' | 'sql' | 'explanation'>('table');
  const [showExamples, setShowExamples] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to results when they appear
  useEffect(() => {
    if ((tableData || sqlQuery || result) && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tableData, sqlQuery, result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError("");
    setSqlQuery("");
    setResult("");
    setTableData(null);
    setShowExamples(false);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      setResult(data.result);
      setSqlQuery(data.sqlQuery || "");
      setTableData(data.tableData || null);
      
      // Set the most appropriate default tab
      if (data.tableData && data.tableData.headers.length > 0) {
        setActiveTab('table');
      } else if (data.sqlQuery) {
        setActiveTab('sql');
      } else {
        setActiveTab('explanation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };
  
  const handleExampleClick = async (exampleQuery: string) => {
    setQuery(exampleQuery);
    setShowExamples(false);
    
    // Automatically generate results for the selected example query
    setLoading(true);
    setError("");
    setSqlQuery("");
    setResult("");
    setTableData(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: exampleQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      setResult(data.result);
      setSqlQuery(data.sqlQuery || "");
      setTableData(data.tableData || null);
      
      // Set the most appropriate default tab
      if (data.tableData && data.tableData.headers.length > 0) {
        setActiveTab('table');
      } else if (data.sqlQuery) {
        setActiveTab('sql');
      } else {
        setActiveTab('explanation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header with animated gradient border */}
      <header className="relative py-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              SQL Query Generator
            </span>
          </h1>
          <p className="text-center text-gray-300 mt-2 max-w-2xl mx-auto">
            Transform natural language questions into SQL queries and visualize database results
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-5xl pb-16">
        {/* Query Input Section */}
        <section className="mb-12">
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="query" className="block text-lg font-medium mb-2 text-gray-200">
                    Ask a question about city population data
                  </label>
                  <div className="relative">
                    <textarea
                      id="query"
                      rows={3}
                      className="w-full p-4 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g., What are the top 5 most populated cities in Europe?"
                      required
                    />
                    {query && (
                      <button 
                        type="button" 
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                        onClick={() => {
                          // Clear the input
                          setQuery('');
                          
                          // Reset the page state
                          setError('');
                          setSqlQuery('');
                          setResult('');
                          setTableData(null);
                          setShowExamples(true);
                        }}
                        aria-label="Clear input and reset page"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span>Generate Results</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Example Queries Section - Collapsible */}
            <div className="border-t border-gray-700 bg-gray-850">
              <button 
                onClick={() => setShowExamples(!showExamples)}
                className="w-full px-6 py-3 text-left flex justify-between items-center hover:bg-gray-750 transition-colors"
              >
                <span className="font-medium text-gray-200">Example Queries</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transform transition-transform ${showExamples ? 'rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showExamples && (
                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "What are the top 10 most populated cities in the world?",
                    "Show me cities in Europe with population over 5 million",
                    "What is the average city population by continent?",
                    "List cities in Asia sorted by population",
                    "Compare the population of cities in North America and Europe"
                  ].map((exampleQuery, index) => (
                    <div key={index} className="group">
                      <button
                        onClick={() => handleExampleClick(exampleQuery)}
                        className="w-full text-left p-3 rounded-lg bg-gray-750 hover:bg-gray-700 group-hover:shadow-md transition-all duration-200 border border-gray-700 group-hover:border-blue-500"
                      >
                        <div className="flex items-start">
                          <span className="text-blue-400 mr-2 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-gray-300 group-hover:text-white">{exampleQuery}</span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results Section */}
        {(tableData || sqlQuery || result || error) && (
          <section ref={resultsRef} className="mb-8 animate-fadeIn">
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
              {/* Error Display */}
              {error && (
                <div className="p-6 bg-red-900/30 border-b border-red-800">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-red-300">Error Occurred</h3>
                      <div className="mt-2 text-red-200">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Tabs */}
              {(tableData || sqlQuery || result) && (
                <>
                  <div className="border-b border-gray-700">
                    <nav className="flex">
                      {tableData && tableData.headers.length > 0 && (
                        <button
                          onClick={() => setActiveTab('table')}
                          className={`px-6 py-4 text-sm font-medium ${activeTab === 'table' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                          Table Results
                        </button>
                      )}
                      {sqlQuery && (
                        <button
                          onClick={() => setActiveTab('sql')}
                          className={`px-6 py-4 text-sm font-medium ${activeTab === 'sql' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                          SQL Query
                        </button>
                      )}
                      {result && (
                        <button
                          onClick={() => setActiveTab('explanation')}
                          className={`px-6 py-4 text-sm font-medium ${activeTab === 'explanation' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                          Explanation
                        </button>
                      )}
                    </nav>
                  </div>

                  <div className="p-6">
                    {/* Table Results */}
                    {activeTab === 'table' && tableData && tableData.headers.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700 rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-gray-750">
                              {tableData.headers.map((header, index) => (
                                <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-gray-850 divide-y divide-gray-700">
                            {tableData.rows.map((row, rowIndex) => (
                              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-850' : 'bg-gray-800'}>
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {cellIndex === 1 && !isNaN(Number(cell.replace(/,/g, ''))) ? (
                                      <span className="font-medium text-blue-400">{cell}</span>
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
                    )}

                    {/* SQL Query */}
                    {activeTab === 'sql' && sqlQuery && (
                      <div className="relative">
                        <div className="absolute top-0 right-0 p-2">
                          <button 
                            onClick={() => navigator.clipboard.writeText(sqlQuery)}
                            className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                            title="Copy SQL query"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                          </button>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm text-green-400 font-mono">{sqlQuery}</pre>
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    {activeTab === 'explanation' && result && (
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 bg-gray-900/50 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Powered by Mastra AI &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
