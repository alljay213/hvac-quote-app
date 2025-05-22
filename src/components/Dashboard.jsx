import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Guard: Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) navigate("/");
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout(); // Ensures the user session is cleared
      navigate("/"); // Redirect to login
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const firstName = currentUser?.firstName || currentUser?.email?.split("@")[0];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 sm:px-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">Welcome, {firstName}</div>
        <button
          onClick={handleLogout}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto text-center bg-white rounded-md shadow-md p-6">
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Choose an option below to get started.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/quote")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
          >
            ➕ Create New Quote
          </button>

          <button
            disabled
            className="w-full py-3 bg-gray-300 text-gray-700 font-medium rounded cursor-not-allowed"
          >
            🗂️ View Saved Quotes (Coming Soon)
          </button>
        </div>
      </main>
    </div>
  );
}
