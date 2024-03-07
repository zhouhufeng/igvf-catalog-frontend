import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { RootState } from "../store";
import { persistReducer } from "redux-persist";

export const regionViewSlice = createSlice({
    name: "regionView",
    initialState: {
        open: false,
    },
    reducers: {
        setOpen: (state, action: PayloadAction<boolean>) => {
            state.open = action.payload;
        }
    }
});
export const { setOpen } = regionViewSlice.actions;

export const selectRegionViewOpen = (state: RootState) => state.regionView.open;

const regionViewReducer = regionViewSlice.reducer;

const regionViewPersistConfig = {
    key: "regionView",
    storage,
};

export default persistReducer(regionViewPersistConfig, regionViewReducer);
