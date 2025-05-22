import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

const serviceOptions = {
  "AC Repair": 150,
  "Furnace Tune-Up": 120,
  "Full HVAC Install": 5000,
  "Thermostat Replacement": 250,
};

const TAX_RATE = 0.13;
const SERVICE_FEE_RATE = 0.05;

export default function QuoteBuilder() {
  const [selectedService, setSelectedService] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      const snapshot = await getDocs(collection(db, "quotes"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuotes(data);
    };

    fetchQuotes();
  }, []);

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);
    const price = serviceOptions[service] || 0;
    const taxAmt = price * TAX_RATE;
    const fee = price * SERVICE_FEE_RATE;
    setBasePrice(price);
    setTax(taxAmt);
    setServiceFee(fee);
    setTotal(price + taxAmt + fee);
  };

  const handleSubmit = async () => {
    if (!selectedService) return alert("Please select a service.");
    setLoading(true);
    try {
      await addDoc(collection(db, "quotes"), {
        service: selectedService,
        estimate: total,
        createdAt: serverTimestamp(),
      });
      alert("Quote saved!");
      setSelectedService("");
      setBasePrice(0);
      setTax(0);
      setServiceFee(0);
      setTotal(0);
    } catch (err) {
      alert("Failed to save quote: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8 transition-all">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        HVAC Quote Calculator
      </h2>

      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Service
      </label>
      <select
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        value={selectedService}
        onChange={handleServiceChange}
      >
        <option value="">-- Choose a Service --</option>
        {Object.entries(serviceOptions).map(([name, price]) => (
          <option key={name} value={name}>
            {name} - ${price}
          </option>
        ))}
      </select>

      <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 space-y-1 mb-6">
        <p>Base: ${basePrice.toFixed(2)}</p>
        <p>Tax (13%): ${tax.toFixed(2)}</p>
        <p>Service Fee (5%): ${serviceFee.toFixed(2)}</p>
        <p className="font-semibold text-black dark:text-white">
          Total: ${total.toFixed(2)}
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-3 font-semibold text-white rounded-lg transition 
        ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Saving..." : "Save Quote"}
      </button>

      {/* Quote History */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          Quote History
        </h3>
        <ul className="space-y-3">
          {quotes.map((q) => (
            <li
              key={q.id}
              className="border dark:border-gray-600 rounded p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <p>🛠️ {q.service}</p>
              <p>💲 ${q.estimate.toFixed(2)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                📅 {q.createdAt?.toDate().toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
