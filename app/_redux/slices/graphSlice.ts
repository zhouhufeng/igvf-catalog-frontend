import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { GraphNode } from "@/lib/types/derived-types";
import { catalog } from "@/lib/catalog-interface/catalog";

export interface TableGraphNode extends GraphNode {
    isExpanded: boolean;
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
        tableRoot: {} as RootTableState,
    },
    reducers: {
        setRootKey: (state, action: PayloadAction<{ key: string, data: GraphNode[] }>) => {
            const { key, data } = action.payload;
            state.tableRoot[key] = data.reduce((acc, node) => {
                const nodeModel = catalog.deserialize(node);
                acc[nodeModel.parsed.id] = {
                    ...node,
                    isExpanded: false,
                    children: {},
                };
                return acc;
            }, {} as GraphTableState);
        },
        setPathChildren: (state, action: PayloadAction<{ path: string[], data: GraphNode[] }>) => {
            const { path, data } = action.payload;
            const parent = selectGraphPath({ graph: state } as RootState, path);
            if (!parent) return;
            parent.children = data.reduce((acc, node) => {
                const nodeModel = catalog.deserialize(node);
                acc[nodeModel.parsed.id] = {
                    ...node,
                    isExpanded: false,
                    children: {},
                };
                return acc;
            }, {} as GraphTableState);
        },
        toggleExpandAtPath: (state, action: PayloadAction<{ path: string[] }>) => {
            const node = selectGraphPath({ graph: state } as RootState, action.payload.path);
            if (!node) return;
            node.isExpanded = !node.isExpanded;
        },
    }
});

export const { setRootKey, setPathChildren, toggleExpandAtPath } = graphSlice.actions;

export const selectRootKey = (state: RootState, key: string): GraphTableState | undefined => state.graph.tableRoot[key];

export const selectGraphPath = (state: RootState, path: string[]) => {
    const start = state.graph.tableRoot[path[0]];
    if (!start) return null;
    if (path.length === 1) return start;

    let current = start[path[1]];

    for (let i = 2; i < path.length; i++) {
        current = current.children[path[i]];
    }
    return current;
};

export const selectGraphNodes = (state: RootState, path: string[]) => {
    const node = selectGraphPath(state, path);
    if (!node) return null;
    return node.children || node;
}

export default graphSlice.reducer;
