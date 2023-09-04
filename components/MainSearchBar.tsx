import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { SlashCommandType, addSearchHistoryEntry, deleteAtTimestamp, selectSearchHistory, selectSearchQuery, selectSlashCommand, setSearchQuery, setSlashCommand } from "@/app/_redux/slices/searchSlice";
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
    rightAdornment,
    onClick,
}: {
    icon: React.ReactNode;
    text: string;
    desc: string;
    rightAdornment?: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <div
            className="cursor-pointer hover:bg-gray-100 p-1 pr-2 rounded-xl flex flex-row justify-between items-center"
            onClick={onClick}
        >
            <div className="flex items-center gap-x-2">
                <div className="flex-shrink-0">{icon}</div>
                <div>
                    <div className="text-sm font-medium">{text}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                </div>
            </div>
            <div onClick={e => e.stopPropagation()}>
                {rightAdornment}
            </div>
        </div>
    );
}

type TypeToEmoji = {
    [key in (QueryType | keyof typeof exactTypes)]: string;
};

const typeToEmoji: TypeToEmoji = {
    gene: "🧬",
    "ontology term": "📚",
    protein: "💪",
    rs: "🦠",
};

export const exactTypes = {
    "rs": {
        path: "/rsid",
        message: "You're entering a variant ID. Enter the full ID then click here to search.",
    }
}

const getTypeFromQuery = (query: string): keyof typeof exactTypes | null => {
    for (let prefix of Object.keys(exactTypes)) {
        if (query.startsWith(prefix)) {
            return prefix as keyof typeof exactTypes;
        }
    }
    return null;
}

type ResultStatus = "idle" | "loading" | "fulfilled" | "empty";

export default function MainSearchBar() {
    const dispatch = useAppDispatch();
    const searchQuery = useAppSelector(selectSearchQuery);
    const recentSearches = useAppSelector(selectSearchHistory);
    const slashCommand = useAppSelector(selectSlashCommand);
    const router = useRouter();

    const [focused, setFocused] = useState(false);
    const [resultsStatus, setResultsStatus] = useState<ResultStatus>("idle");
    const [results, setResults] = useState<AutocompleteResp[]>([]);
    const [exactType, setExactType] = useState<keyof typeof exactTypes | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const textFieldRef = useRef<HTMLInputElement>(null);

    const allSlashCommands: SlashCommandType[] = AutocompleteService.allTypes;

    const renderSearchSuggestions = () => {
        if (exactType !== null) {
            return (
                <SearchSuggestionBase
                    icon={<div className="text-gray-500 text-sm">{typeToEmoji[exactType] || '🔎'}</div>}
                    text={`"${searchQuery}"`}
                    desc={exactTypes[exactType].message}
                    onClick={() => {
                        router.push(`${exactTypes[exactType].path}/${searchQuery}`);
                        dispatch(addSearchHistoryEntry({
                            result: {
                                term: searchQuery,
                                uri: `${exactTypes[exactType].path}/${searchQuery}`,
                                type: exactType,
                            },
                            timestamp: Date.now(),
                        }));
                    }}
                    key={`searchResult-${exactType}`}
                />
            )   
        }
        if (resultsStatus === "loading") return (
            <Skeleton count={6} height={26} style={{ marginTop: 18, }} />
        );
        if (resultsStatus === "empty") return (
            <div className="flex items-center my-1">
                <div className="text-gray-500 text-sm">No results found.</div>
            </div>
        );

        const suggestions: React.ReactNode[] = [];
        // render slash search filters (e.g. /gene, /variant, /disease)
        // render up to last 6 searches + example searches if focused but no input
        // render search results

        if (resultsStatus === "fulfilled") {
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
                            router.push(result.uri);
                            dispatch(addSearchHistoryEntry({
                                result,
                                timestamp: Date.now(),
                            }));
                        }}
                        key={`searchResult-${i}`}
                    />
                );
            }

            return suggestions;
        }

        if (!searchQuery.startsWith('/') && recentSearches.length > 0) {
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
                            router.push(res.result.uri);
                            dispatch(addSearchHistoryEntry({
                                result: res.result,
                                timestamp: Date.now(),
                            }));
                        }}
                        rightAdornment={
                            <div className="text-xs text-gray-500" onClick={() => {
                                dispatch(deleteAtTimestamp(res.timestamp));
                            }}>
                                Delete
                            </div>
                        }
                        key={`recentSearch-${i}`}
                    />
                );
            }
        }

        suggestions.push(
            <SearchSuggestionDivider text="Filters" key="filters" />
        );
        let renderedCommands = allSlashCommands;
        if (searchQuery.startsWith('/')) {
            renderedCommands = allSlashCommands.filter((type) => type.startsWith(searchQuery.slice(1)));
        }
        renderedCommands.forEach((type) => {
            suggestions.push(
                <SearchSuggestionBase
                    icon={<div className="text-gray-500 text-sm">{typeToEmoji[type] || '🔎'}</div>}
                    text={`/${type}`}
                    desc="Search by type"
                    onClick={() => {
                        dispatch(setSlashCommand(type));
                        dispatch(setSearchQuery(""));
                        textFieldRef.current?.focus();
                    }}
                    key={`filter-${type}`}
                />
            );
        });

        return suggestions;
    }

    const updateSearch = async (query: string) => {
        if (!query.length || query.startsWith('/') || exactType !== null) {
            setResultsStatus("idle");
            setResults([]);
            return;
        }
        let data;
        if (slashCommand && AutocompleteService.allTypes.includes(slashCommand)) {
            data = await AutocompleteService.getAutocompleteResults(query, slashCommand);
        } else {
            data = await AutocompleteService.getAutocompleteResults(query);
        }

        setResults(data);

        setResultsStatus(data.length > 0 ? "fulfilled" : "empty");
    };

    const handleClear = () => {
        dispatch(setSearchQuery(""));
        dispatch(setSlashCommand(null));
        setFocused(false);
    }

    const debouncedUpdateSearch = useCallback(debounce(updateSearch, 500), [slashCommand, exactType]);

    useEffect(() => {
        const queryType = getTypeFromQuery(searchQuery);
        if (searchQuery.startsWith('/') || queryType !== null) {
            updateSearch(searchQuery);
            if (allSlashCommands.includes(searchQuery.slice(1) as any)) {
                dispatch(setSlashCommand(searchQuery.slice(1) as SlashCommandType));
                setResultsStatus("idle");
                dispatch(setSearchQuery(""));
            }
        } else {
            debouncedUpdateSearch(searchQuery);
            if (searchQuery.length > 0) {
                setResultsStatus("loading");
                setFocused(true);
            }
        }
        if (queryType !== exactType) {
            setExactType(queryType);
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
                <div
                    className={classNames(
                        "flex flex-row items-center outline-none bg-white w-full rounded-2xl h-14 border-0 pr-11 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400sm:text-sm sm:leading-6",
                        { "rounded-b-none": expanded }
                    )}
                >
                    {!slashCommand ? (
                        <div className="pointer-events-none inset-y-0 left-0 flex items-center pl-3 pr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    ) : (
                        <h1 className="text-2xl ml-2 pl-2 pr-2 mr-2 py-1 bg-purple-300 rounded-2xl">/{slashCommand}</h1>
                    )}
                    <input
                        type="text"
                        id="search-query"
                        ref={textFieldRef}
                        className={classNames(
                            "outline-none block text-2xl flex-1 rounded-2xl border-0 py-1.5",
                            { "rounded-b-none": expanded }
                        )}
                        placeholder="rs7582141, TP53, 1433B_HUMAN, cancer ..."
                        onFocus={() => setFocused(true)}
                        onKeyDown={(e) => {
                            if (e.key === "Backspace" && searchQuery.length === 0) {
                                dispatch(setSlashCommand(null));
                            }
                        }}
                        onChange={(e) => {
                            dispatch(setSearchQuery(e.target.value));
                        }}
                        value={searchQuery}
                        autoComplete="off"
                    />
                </div>
                {(searchQuery.length > 0 || focused) && (
                    <div
                        className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={handleClear}
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
