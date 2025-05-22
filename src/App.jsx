import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import QuoteBuilder from "./components/QuoteBuilder";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/quote"
          element={
            <PrivateRoute>
              <QuoteBuilder />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
