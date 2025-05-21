import { useEffect, useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 m-4 bg-gray-200 dark:bg-gray-800 rounded"
      >
        Toggle Dark Mode
      </button>
      {/* Rest of your components */}
    </div>
  );
}

export default App;
