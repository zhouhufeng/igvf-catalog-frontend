import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        title: null as string | null,
    },
    reducers: {
        setTitle: (state, action: PayloadAction<string | null>) => {
            state.title = action.payload;
        }        
    }
});

export const { setTitle } = uiSlice.actions;

export const selectTitle = (state: RootState) => state.ui.title;

const uiReducer = uiSlice.reducer;

const settingsPersistConfig = {
    key: "settings",
    blacklist: ['title'],
    storage,
};

export default persistReducer(settingsPersistConfig, uiReducer);
