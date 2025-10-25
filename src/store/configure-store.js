import { configureStore } from "@reduxjs/toolkit";

// Create a function to configure the store
export const configureAppStore = (rootReducer) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: true,
  });
};

export default configureAppStore; 