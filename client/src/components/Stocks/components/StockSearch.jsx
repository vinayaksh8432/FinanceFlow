import { XCircle } from "@phosphor-icons/react";
import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { mockSearchResults } from "../mock";

export default function StockSearch({ onStockSelect }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

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
                const filteredResults = mockSearchResults.result.filter(
                    (item) =>
                        item.symbol.toLowerCase().includes(searchTerm) ||
                        item.description.toLowerCase().includes(searchTerm)
                );
                setResults(filteredResults);
                setIsLoading(false);
            }, 300);
        } else {
            setResults([]);
        }
    };

    const handleResultClick = (result) => {
        setQuery(result.description);
        setShowResults(false);
        if (Array.isArray(result.c)) {
            result.c = result.c.map((value) =>
                !isNaN(value) ? Number(value).toFixed(2) : value
            );
        } else if (
            result.c !== undefined &&
            result.c !== null &&
            !isNaN(result.c)
        ) {
            result.c = Number(result.c).toFixed(2);
        } else {
            result.c = result.c;
        }
        onStockSelect(result);
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
                                <li key={result.symbol}>
                                    <button
                                        onClick={() =>
                                            handleResultClick(result)
                                        }
                                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors duration-150"
                                    >
                                        <div className="flex justify-between w-full">
                                            <span className="font-medium text-gray-900 group-hover:text-blue-600">
                                                {result.description}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {result.symbol}
                                            </span>
                                        </div>
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
