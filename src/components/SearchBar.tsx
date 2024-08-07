"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
    productNames: string[] | null;
    query: string;
    filteredSuggestions: string[];
    showSuggestions: boolean;
    setQuery: (query: string) => void;
    setFilteredSuggestions: (suggestions: string[]) => void;
    setShowSuggestions: (showSuggestions: boolean) => void;
    pressEnter: (event: any) => void;
}

const SearchBar: FC<SearchBarProps> = ({
    productNames,
    query,
    filteredSuggestions,
    showSuggestions,
    setQuery,
    setFilteredSuggestions,
    setShowSuggestions,
    pressEnter,
}) => {
    const router = useRouter();

    const suggestions = productNames;

    const handleChange = (event: any) => {
        if (!suggestions) {
            return null;
        }

        const userInput = event.target.value;
        setQuery(userInput);

        if (userInput) {
            const filtered = suggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(userInput.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        const encodedQuery = encodeURIComponent(suggestion.trim());
        router.push(`/search/${encodedQuery}`);
    };

    return (
        <div className="w-96">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="검색어 입력..."
                className="w-full px-4 py-2 font-semibold rounded-2xl shadow-md border border-gray-300 bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyDown={pressEnter}
            />
            {showSuggestions && (
                <div className="absolute z-10 w-96 bg-white border border-gray-300 rounded-b-lg shadow-md">
                    {filteredSuggestions.length > 0 ? (
                        <ul>
                            {filteredSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-2 text-gray-500">
                            추천 검색어 없음
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
