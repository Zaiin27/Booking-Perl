import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import "./styles/global.css";
import AppRouter from "./router.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import store, { persistor } from "./store";

import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "❌ Root element not found. Make sure <div id='root'></div> exists in index.html"
  );
}

createRoot(rootElement).render(
  <StrictMode>
    {/* <Suspense fallback={<Spinner />}> */}
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <BrowserRouter>
            <AppRouter />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  style: {
                    background: "#10B981",
                    color: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: "#EF4444",
                    color: "#fff",
                  },
                },
                loading: {
                  style: {
                    background: "#3B82F6",
                    color: "#fff",
                  },
                },
              }}
            />
          </BrowserRouter>
        </ErrorBoundary>
      </PersistGate>
    </Provider>
    {/* </Suspense> */}
  </StrictMode>
);
