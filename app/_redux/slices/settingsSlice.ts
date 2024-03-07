import { NodeType } from "@/lib/types/derived-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { RootState } from "../store";
import { SizingType } from "reagraph";

export type ColorMapType = {
    [key in NodeType]: string;
};

export type ClusterStrategy = "unclustered" | "rootNode" | "density";

const liveGraph = {
    loadDepth: 2,
    clusterStrategy: "unclustered" as ClusterStrategy,
    sizingType: "centrality" as SizingType,
};

export type LiveGraphSettings = typeof liveGraph;

export const BASE_THICKNESS = 10;

const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        colorMap: {} as ColorMapType,
        dashedTypes: [] as NodeType[],
        edgeThickness: BASE_THICKNESS,
        liveGraph,
    },
    reducers: {
        setColors: (state, action: PayloadAction<ColorMapType>) => {
            state.colorMap = action.payload;
        },
        addDashedType: (state, action: PayloadAction<NodeType>) => {
            state.dashedTypes.push(action.payload);
        },
        removeDashedType: (state, action: PayloadAction<NodeType>) => {
            state.dashedTypes = state.dashedTypes.filter(
                (type) => type !== action.payload
            );
        },
        setEdgeThickness: (state, action: PayloadAction<number>) => {
            state.edgeThickness = action.payload;
        },
        setLiveGraphSettings: (state, action: PayloadAction<Partial<LiveGraphSettings>>) => {
            state.liveGraph = {
                ...state.liveGraph,
                ...action.payload,
            };
        }
    }
});

export const { setColors, addDashedType, removeDashedType, setEdgeThickness, setLiveGraphSettings } = settingsSlice.actions;

export const selectColors = (state: RootState) => state.settings.colorMap;
export const selectDashedTypes = (state: RootState) => state.settings.dashedTypes;
export const selectEdgeThickness = (state: RootState) => state.settings.edgeThickness;
export const selectLiveGraphSettings = (state: RootState) => state.settings.liveGraph;

const settingsReducer = settingsSlice.reducer;

const settingsPersistConfig = {
    key: "settings",
    storage,
};

export default persistReducer(settingsPersistConfig, settingsReducer);
