import { PayloadAction, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AutocompleteResp } from "@/lib/services/AutocompleteService";

export interface SearchHistoryEntry {
    result: AutocompleteResp;
    timestamp: number;
}

const searchHistoryAdapter = createEntityAdapter<SearchHistoryEntry>({
    selectId: (entry) => entry.timestamp + entry.result.uri,
    sortComparer: (a, b) => b.timestamp - a.timestamp,
});

export const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchHistory: searchHistoryAdapter.getInitialState(),
        searchQuery: "",
    },
    reducers: {
        addSearchHistoryEntry: (state, action: PayloadAction<SearchHistoryEntry>) => {
            searchHistoryAdapter.addOne(state.searchHistory, action.payload);
        },
        clearSearchHistory: (state) => {
            searchHistoryAdapter.removeAll(state.searchHistory);
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        }
    }
});

export const { addSearchHistoryEntry, clearSearchHistory, setSearchQuery } = searchSlice.actions;

export const searchHistorySelectors = searchHistoryAdapter.getSelectors<RootState>(
    (state) => state.search.searchHistory
);

export const selectSearchHistory = searchHistorySelectors.selectAll;
export const selectSearchQuery = (state: RootState) => state.search.searchQuery;

export default searchSlice.reducer;
