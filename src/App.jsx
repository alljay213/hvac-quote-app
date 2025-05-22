import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import QuoteBuilder from "./components/QuoteBuilder";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Router>
        <header className="flex justify-between items-center p-4 sm:px-8">
          <h1 className="text-xl sm:text-2xl font-bold">HVAC Quote App</h1>
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
