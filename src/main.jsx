import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <Toaster
          position="top-center"
          theme="dark"
          richColors
          closeButton
          duration={2200}
          expand={false}
          visibleToasts={3}
          offset={25}
        />
        <App />
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
