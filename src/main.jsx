import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import "./styles/tokens.css";
import "./styles/globals.css";
import "./styles/glass.css";
import "./styles/animations.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.92)",
              color: "#f8fafc",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(14px)",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
