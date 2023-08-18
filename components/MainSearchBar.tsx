import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { addSearchHistoryEntry, selectSearchHistory, selectSearchQuery, setSearchQuery } from "@/app/_redux/slices/searchSlice";
import AutocompleteService, { AutocompleteResp, QueryType } from "@/lib/services/AutocompleteService";
import { debounce } from "@/lib/utils";
import classNames from "classnames";
import { useRouter } from "next13-progressbar";
import Skeleton from 'react-loading-skeleton';

function SearchSuggestionDivider({ text }: { text: string }) {
    return (
        <div className="flex items-center my-1">
            <div className="text-gray-500 text-sm">{text}</div>
        </div>
    );
}

function SearchSuggestionBase({
    icon,
    text,
    desc,
    onClick,
}: {
    icon: React.ReactNode;
    text: string;
    desc: string;
    onClick: () => void;
}) {
    return (
        <div
            className="flex items-center gap-x-2 cursor-pointer"
            onClick={onClick}
        >
            <div className="flex-shrink-0">{icon}</div>
            <div>
                <div className="text-sm font-medium">{text}</div>
                <div className="text-xs text-gray-500">{desc}</div>
            </div>
        </div>
    );
}

type TypeToEmoji = {
    [key in QueryType]: string;
};

const typeToEmoji: TypeToEmoji = {
    gene: "🧬",
    "ontology term": "📚",
    protein: "💪",
};

export default function MainSearchBar() {
    const dispatch = useAppDispatch();
    const searchQuery = useAppSelector(selectSearchQuery);
    const recentSearches = useAppSelector(selectSearchHistory);
    const router = useRouter();

    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<AutocompleteResp[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);

    const renderSearchSuggestions = () => {
        if (loading) return (
            <Skeleton count={6} height={26} style={{ marginTop: 10, }} />
        );

        const suggestions: React.ReactNode[] = [];
        // render up to last 6 searches + example searches if focused but no input
        // render slash search filters (e.g. /gene, /variant, /disease)
        // render search results

        if (results.length > 0) {
            suggestions.push(
                <SearchSuggestionDivider text="Search Results" key="searchResults" />
            );

            for (let i = 0; i < Math.min(results.length, 6); i++) {
                const result = results[i];
                if (!result) continue;
                suggestions.push(
                    <SearchSuggestionBase
                        icon={<div className="text-gray-500 text-sm">{typeToEmoji[result.type] || '🔎'}</div>}
                        text={result.term}
                        desc={result.type}
                        onClick={() => {
                            dispatch(addSearchHistoryEntry({
                                result,
                                timestamp: Date.now(),
                            }));
                            router.push(result.uri)
                        }}
                        key={`searchResult-${i}`}
                    />
                );
            }

            return suggestions;
        }


        if (recentSearches.length > 0) {
            suggestions.push(
                <SearchSuggestionDivider text="Recent Searches" key="recentSearches" />
            );
            for (let i = 0; i < Math.min(recentSearches.length, 6); i++) {
                const res = recentSearches[i];
                if (!res) continue;
                suggestions.push(
                    <SearchSuggestionBase 
                        text={res.result.term}
                        desc={res.result.type}
                        icon={<div className="text-gray-500 text-sm">{typeToEmoji[res.result.type] || '🔎'}</div>}
                        onClick={() => {
                            dispatch(addSearchHistoryEntry({
                                result: res.result,
                                timestamp: Date.now(),
                            }));
                            router.push(res.result.uri)
                        }}
                        key={`recentSearch-${i}`}
                    />
                );
            }
        }

        return suggestions;
    }

    const updateSearch = async (query: string) => {
        if (!query.length) {
            setLoading(false);
            setResults([]);
            return;
        };
        const data = await AutocompleteService.getAutocompleteResults(query);

        setResults(data);

        setLoading(false);
    };

    const debouncedUpdateSearch = useCallback(debounce(updateSearch, 500), []);

    useEffect(() => {
        debouncedUpdateSearch(searchQuery);
        if (searchQuery.length > 0) {
            setLoading(true);
        }
    }, [searchQuery]);

    useEffect(() => {
        function handleClickOutside(event: any) {
          if (containerRef.current && !containerRef.current.contains(event.target)) {
            setFocused(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [containerRef]);

    const expanded = focused || searchQuery.length > 0;

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative mt-2 rounded-2xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
                <input
                    type="text"
                    id="search-query"
                    className={classNames(
                        "outline-none block w-full text-2xl rounded-2xl h-14 border-0 py-1.5 pl-11 pr-11 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400sm:text-sm sm:leading-6",
                        { "rounded-b-none": expanded }
                    )}
                    placeholder="1433B_HUMAN, rs78196225..."
                    onFocus={() => setFocused(true)}
                    onChange={(e) => {
                        dispatch(setSearchQuery(e.target.value));
                    }}
                    value={searchQuery}
                    autoComplete="off"
                />
                {(searchQuery.length > 0 || focused) && (
                    <div
                        className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => {
                            dispatch(setSearchQuery(""));
                            setFocused(false);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}
            </div>
            {expanded &&
                <div className="absolute w-full border p-2 py-3 rounded-b-2xl bg-white">
                    {renderSearchSuggestions()}
                </div>
            }
        </div>
    );
}
