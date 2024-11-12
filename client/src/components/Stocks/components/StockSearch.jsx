import { XCircle } from "@phosphor-icons/react";
import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";

export default function StockSearch({ onStockSelect }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    const sampleData = {
        bestMatches: [
            {
                "1. symbol": "TSCO.LON",
                "2. name": "Tesco PLC",
                "3. type": "Equity",
                "4. region": "United Kingdom",
                "5. marketOpen": "08:00",
                "6. marketClose": "16:30",
                "7. timezone": "UTC+01",
                "8. currency": "GBX",
                "9. matchScore": "0.7273",
            },
            {
                "1. symbol": "TSCDF",
                "2. name": "Tesco plc",
                "3. type": "Equity",
                "4. region": "United States",
                "5. marketOpen": "09:30",
                "6. marketClose": "16:00",
                "7. timezone": "UTC-04",
                "8. currency": "USD",
                "9. matchScore": "0.7143",
            },
            {
                "1. symbol": "RELIANCE.BSE",
                "2. name": "Reliance Industries Limited",
                "3. type": "Equity",
                "4. region": "India",
                "5. marketOpen": "09:15",
                "6. marketClose": "15:30",
                "7. timezone": "UTC+05:30",
                "8. currency": "INR",
                "9. matchScore": "0.8143",
            },
        ],
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setQuery(searchTerm);
        setShowResults(true);

        if (searchTerm) {
            setIsLoading(true);
            // Simulate API delay
            setTimeout(() => {
                const filteredResults = sampleData.bestMatches.filter(
                    (item) =>
                        item["1. symbol"].toLowerCase().includes(searchTerm) ||
                        item["2. name"].toLowerCase().includes(searchTerm)
                );
                setResults(filteredResults);
                setIsLoading(false);
            }, 300);
        } else {
            setResults([]);
        }
    };

    const handleResultClick = (result) => {
        setQuery(result["2. name"]); // Set the company name instead of symbol for better UX
        setShowResults(false);
        onStockSelect(result); // Pass the selected stock data to parent component
    };

    return (
        <div className="relative w-full max-w-xs" ref={searchRef}>
            <div className="flex items-center bg-white px-3 rounded-full overflow-hidden text-base relative border border-gray-300">
                <FiSearch className="text-gray-400" size={22} />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search stocks..."
                    className="p-2 w-full outline-none text-gray-700 placeholder-gray-400"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                            setShowResults(false);
                        }}
                        className="text-gray-400 absolute right-4"
                    >
                        <XCircle size={18} />
                    </button>
                )}
            </div>

            {showResults && (query || isLoading) && (
                <div className="z-10 absolute w-full bg-white rounded-xl mt-2 border border-gray-200 shadow-lg overflow-hidden text-sm">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500 mx-auto flex flex-col items-center">
                            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                            <p className="mt-2">Searching...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <ul className="max-h-[300px] overflow-y-auto">
                            {results.map((result, index) => (
                                <li key={result["1. symbol"]}>
                                    <button
                                        onClick={() =>
                                            handleResultClick(result)
                                        }
                                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors duration-150"
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium text-gray-900 group-hover:text-blue-600">
                                                {result["2. name"]}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {result["1. symbol"]}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {result["4. region"]}
                                        </span>
                                    </button>
                                    {index < results.length - 1 && (
                                        <hr className="border-gray-100" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
