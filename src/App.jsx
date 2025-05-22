import { useEffect, useState } from "react";
import QuoteBuilder from "./components/QuoteBuilder";

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <header className="flex justify-between items-center p-4 sm:px-8">
        <h1 className="text-xl sm:text-2xl font-bold">HVAC Quote App</h1>
      </header>

      <main className="flex justify-center p-4">
        <QuoteBuilder />
      </main>
    </div>
  );
}

export default App;
