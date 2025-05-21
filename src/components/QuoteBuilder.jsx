import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const serviceOptions = {
  "AC Repair": 150,
  "Furnace Tune-Up": 120,
  "Full HVAC Install": 5000,
  "Thermostat Replacement": 250,
};

export default function QuoteBuilder() {
  const [selectedService, setSelectedService] = useState("");
  const [estimate, setEstimate] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    setEstimate(serviceOptions[service] || 0);
  };

  const handleSubmit = async () => {
    if (!selectedService) return alert("Please select a service.");
    setLoading(true);
    try {
      await addDoc(collection(db, "quotes"), {
        service: selectedService,
        estimate,
        createdAt: serverTimestamp(),
      });
      alert("Quote saved successfully!");
      setSelectedService("");
      setEstimate(0);
    } catch (error) {
      alert("Error saving quote: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          HVAC Quote Calculator
        </h1>

        <label className="block mb-2 text-sm sm:text-base font-medium text-gray-700">
          Select a Service
        </label>
        <select
          value={selectedService}
          onChange={handleServiceChange}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Choose a Service --</option>
          {Object.entries(serviceOptions).map(([service, price]) => (
            <option key={service} value={service}>
              {service} - ${price}
            </option>
          ))}
        </select>

        <div className="mb-6">
          <p className="text-gray-600 text-sm sm:text-base">
            Estimated Cost:{" "}
            <span className="font-semibold text-black">${estimate}</span>
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 text-white rounded-lg font-semibold transition duration-300 
            ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Saving..." : "Save Quote"}
        </button>
      </div>
    </div>
  );
}
