import { PayloadAction, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AutocompleteResp } from "@/lib/services/AutocompleteService";

export interface SearchHistoryEntry {
    result: AutocompleteResp;
    timestamp: number;
}

const searchHistoryAdapter = createEntityAdapter<SearchHistoryEntry>({
    selectId: (entry) => entry.timestamp,
    sortComparer: (a, b) => b.timestamp - a.timestamp,
});

const maxHistoryLength = 24;

export const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchHistory: searchHistoryAdapter.getInitialState(),
        searchQuery: "",
    },
    reducers: {
        addSearchHistoryEntry: (state, action: PayloadAction<SearchHistoryEntry>) => {
            const curHistory = searchHistoryAdapter.getSelectors().selectAll(state.searchHistory);
            let toRemove: SearchHistoryEntry[] = [];
            if (curHistory.find((e) => e.result.uri === action.payload.result.uri)) {
                toRemove.push(...curHistory.filter((e) => e.result.uri === action.payload.result.uri));
                console.log(toRemove);
            }
            if (curHistory.length > maxHistoryLength) {
                toRemove.push(...curHistory.slice(maxHistoryLength));
            }
            searchHistoryAdapter.removeMany(state.searchHistory, toRemove.map((e) => e.timestamp));
            searchHistoryAdapter.addOne(state.searchHistory, action.payload);
        },
        deleteAtTimestamp: (state, action: PayloadAction<number>) => {
            searchHistoryAdapter.removeOne(state.searchHistory, action.payload);
        },
        clearSearchHistory: (state) => {
            searchHistoryAdapter.removeAll(state.searchHistory);
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        }
    }
});

export const { addSearchHistoryEntry, clearSearchHistory, setSearchQuery, deleteAtTimestamp } = searchSlice.actions;

export const searchHistorySelectors = searchHistoryAdapter.getSelectors<RootState>(
    (state) => state.search.searchHistory
);

export const selectSearchHistory = searchHistorySelectors.selectAll;
export const selectSearchQuery = (state: RootState) => state.search.searchQuery;

export default searchSlice.reducer;
