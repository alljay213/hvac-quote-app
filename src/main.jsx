import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext"; // ✅ Step 1: import it

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {" "}
      {/* ✅ Step 2: wrap your app */}
      <App />
    </AuthProvider>
  </StrictMode>
);
