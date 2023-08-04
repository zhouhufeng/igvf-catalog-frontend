import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { addSearchHistoryEntry, selectSearchHistory, selectSearchQuery, setSearchQuery } from "@/app/_redux/slices/searchSlice";
import classNames from "classnames";
import { useEffect, useState } from "react";

function SearchSuggestionDivider({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-x-2">
            <div className="text-gray-500 text-sm">{text}</div>
        </div>
    );
}

function SearchSuggestionBase({

}: {

    }) {

}

export default function MainSearchBar() {
    const dispatch = useAppDispatch();
    const searchQuery = useAppSelector(selectSearchQuery);
    const recentSearches = useAppSelector(selectSearchHistory);

    const [focused, setFocused] = useState(false);

    const renderSearchSuggestions = () => {
        const suggestions: React.ReactNode[] = [];
        // render up to last 6 searches + example searches if focused but no input
        // render slash search filters (e.g. /gene, /variant, /disease)
        // render search results

        if (recentSearches.length > 0) {
            suggestions.push(
                <SearchSuggestionDivider text="Recent Searches" key="recentSearches" />
            );

            for (let i = 0; i < Math.min(recentSearches.length, 6); i++) {
                const search = recentSearches[i];
                if (!search) continue;
                suggestions.push(
                    <div
                        className="flex items-center gap-x-2"
                        key={`recentSearch-${i}`}
                        onClick={() => {
                            dispatch(setSearchQuery(search));
                            dispatch(addSearchHistoryEntry(search));
                        }}
                    >
                        <div className="text-gray-500 text-sm">{search.query}</div>
                    </div>
                );
            }
        }

        return suggestions;
    }

    const expanded = focused || searchQuery.length > 0;

    return (
        <div className="relative">
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
                    onBlur={() => setFocused(false)}
                    onChange={(e) => {
                        dispatch(setSearchQuery(e.target.value));
                    }}
                    value={searchQuery}
                    autoComplete="off"
                />
                {searchQuery.length > 0 && (
                    <div
                        className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => {
                            dispatch(setSearchQuery(""));
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
