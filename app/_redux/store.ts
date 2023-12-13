import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

import graphReducer from './slices/graphSlice';
import searchReducer from "./slices/searchSlice";
import uiReducer from "./slices/uiSlice";
import settingsReducer from "./slices/settingsSlice";


const rootReducer = combineReducers({
  graph: graphReducer,
  search: searchReducer,
  ui: uiReducer,
  settings: settingsReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
