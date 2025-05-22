import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import QuoteBuilder from "./components/QuoteBuilder";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Router>
        <header className="flex justify-between items-center p-4 sm:px-8">
          <h1 className="text-xl sm:text-2xl font-bold">HVAC Quote App</h1>
          {currentUser && (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-sm bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          )}
        </header>

        <main className="flex justify-center p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/quote-builder"
              element={
                <PrivateRoute>
                  <QuoteBuilder />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
