import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto text-center space-y-6">
      <h2 className="text-2xl font-bold">Welcome to HVAC Quote App</h2>
      <p className="text-gray-600">Choose an option below to get started.</p>

      <div className="space-x-4">
        <button
          onClick={() => navigate("/quote-builder")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          ➕ Create New Quote
        </button>
        <button
          disabled
          className="bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed"
        >
          📄 View Saved Quotes (Coming Soon)
        </button>
      </div>
    </div>
  );
}
