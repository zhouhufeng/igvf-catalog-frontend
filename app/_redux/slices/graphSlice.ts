import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { GraphNode } from "@/lib/types/derived-types";
import { catalog } from "@/lib/catalog-interface/catalog";

export interface TableGraphNode extends GraphNode {
    isExpanded: boolean;
    isLoading: boolean;
    children: GraphTableState
}

interface GraphTableState {
    [key: string]: TableGraphNode;
}

interface RootTableState {
    [key: string]: GraphTableState;
}

const graphSlice = createSlice({
    name: "graph",
    initialState: {
        root: {} as RootTableState,
    },
    reducers: {
        setRootKey: (state, action: PayloadAction<{ key: string, data: GraphNode[] }>) => {
            const { key, data } = action.payload;
            state.root[key] = data.reduce((acc, node) => {
                const nodeModel = catalog.deserialize(node);
                acc[nodeModel.parsed.id] = {
                    ...node,
                    isExpanded: false,
                    isLoading: false,
                    children: {},
                };
                return acc;
            }, {} as GraphTableState);
        },
    }
});

export const { setRootKey } = graphSlice.actions;

export const selectRootKey = (state: RootState, key: string): GraphTableState | undefined => state.graph.root[key];

export const selectGraphPath = (state: RootState, path: string[]) => {
    const start = state.graph.root[path[0]];
    if (!start) return null;
    if (path.length === 1) return start;

    let current = start[path[1]];
    
    for (let i = 2; i < path.length; i++) {
        current = current.children[path[i]];
    }
    return current;
};

export default graphSlice.reducer;
