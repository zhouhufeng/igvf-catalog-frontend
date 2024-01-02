import { FilterCondition } from "@/lib/filter";
import { NodeType } from "@/lib/types/derived-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SortingState } from "@tanstack/react-table";

import { RootState } from "../store";

export interface Filter {
    nodeType: NodeType;
    fieldPath: string;
    condition: FilterCondition;
    value: number;
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
        },
        removeFilterAtIdx(state, action: PayloadAction<number>) {
            state.filters.splice(action.payload, 1);
        },
        editFilterAtIdx(state, action: PayloadAction<{ idx: number, filter: Filter }>) {
            state.filters[action.payload.idx] = action.payload.filter;
        }
    }
});

export const { setSorting, addFilter, removeFilterAtIdx, editFilterAtIdx } = querySlice.actions;

export const selectFilters = (state: RootState) => state.query.filters; 
export const selectSorting = (state: RootState, type: string) => state.query.sorting[type];

export default querySlice.reducer;
