import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SortingState } from "@tanstack/react-table";

interface Filter {

}

interface RootSorting {
    [key: string]: SortingState;
}

const querySlice = createSlice({
    name: "query",
    initialState: {
        sorting: {} as RootSorting,
        filters: [] as Filter[],
    },
    reducers: {
        setSorting(state, action: PayloadAction<{ type: string, state: SortingState }>) {
            state.sorting[action.payload.type] = action.payload.state;
        },
        addFilter(state, action: PayloadAction<Filter>) {
            state.filters.push(action.payload);
        }
    }
});

export const { setSorting, addFilter } = querySlice.actions;

export const selectFilters = (state: RootState) => state.query.filters; 
export const selectSorting = (state: RootState, type: string) => state.query.sorting[type];

export default querySlice.reducer;
