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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">HVAC Quote Calculator</h1>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Select Service
      </label>
      <select
        value={selectedService}
        onChange={handleServiceChange}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">-- Choose a Service --</option>
        {Object.entries(serviceOptions).map(([service, price]) => (
          <option key={service} value={service}>
            {service} - ${price}
          </option>
        ))}
      </select>

      <div className="mb-4">
        <p className="text-gray-600">
          Estimated Cost:{" "}
          <span className="font-semibold text-black">${estimate}</span>
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Saving..." : "Save Quote"}
      </button>
    </div>
  );
}
