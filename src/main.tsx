import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context.tsx";
import { ReviewProvider } from "./contexts/review-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <>
        <AuthProvider>
          <ReviewProvider>
            <App />
          </ReviewProvider>
        </AuthProvider>
      </>
    </BrowserRouter>
  </StrictMode>
);
