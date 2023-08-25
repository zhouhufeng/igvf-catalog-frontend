import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import searchReducer from "./slices/searchSlice";
import uiReducer from "./slices/uiSlice";

const searchPersistConfig = {
  key: "search",
  storage,
  blacklist: ["searchQuery", "slashCommand"],
};

const persistedSearchReducer = persistReducer(searchPersistConfig, searchReducer);

const rootReducer = combineReducers({
  search: persistedSearchReducer,
  ui: uiReducer,
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
