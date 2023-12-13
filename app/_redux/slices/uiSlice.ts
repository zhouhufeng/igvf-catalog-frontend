import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

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

export default uiSlice.reducer;
