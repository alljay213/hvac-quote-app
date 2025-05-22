import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import QuoteBuilder from "./components/QuoteBuilder";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute user={currentUser}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/quote"
          element={
            <PrivateRoute user={currentUser}>
              <QuoteBuilder />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
