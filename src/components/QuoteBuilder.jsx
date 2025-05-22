import { useState } from "react";

export default function QuoteBuilder() {
  const [client, setClient] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [itemList, setItemList] = useState([
    { catNo: "", description: "", price: "", margin: "" },
  ]);

  const [serviceFee, setServiceFee] = useState("");
  const [total, setTotal] = useState(0);

  const handleClientChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...itemList];
    updated[index][field] = value;
    setItemList(updated);
  };

  const addItemRow = () => {
    setItemList([
      ...itemList,
      { catNo: "", description: "", price: "", margin: "" },
    ]);
  };

  const removeItemRow = (index) => {
    const updated = itemList.filter((_, i) => i !== index);
    setItemList(updated);
  };

  const calculateTotal = () => {
    let subtotal = itemList.reduce((sum, item) => {
      const cost = parseFloat(item.price) || 0;
      const margin = parseFloat(item.margin) || 0;
      const markedUp = cost + (cost * margin) / 100;
      return sum + markedUp;
    }, 0);

    const fee = parseFloat(serviceFee) || 0;
    setTotal(subtotal + fee);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">HVAC Quote Builder</h2>

      {/* Client Info */}
      <div className="grid gap-4 mb-6">
        {["name", "phone", "email", "address"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={`Client ${
              field.charAt(0).toUpperCase() + field.slice(1)
            }`}
            value={client[field]}
            onChange={handleClientChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
        ))}
      </div>

      {/* Item Inputs */}
      <h3 className="font-semibold mb-2">Item</h3>
      {itemList.map((item, index) => (
        <div key={index} className="grid grid-cols-5 gap-3 mb-3 items-center">
          <input
            placeholder="Cat#"
            value={item.catNo}
            onChange={(e) => handleItemChange(index, "catNo", e.target.value)}
            className="p-2 border rounded"
          />
          <input
            placeholder="Description"
            value={item.description}
            onChange={(e) =>
              handleItemChange(index, "description", e.target.value)
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) => handleItemChange(index, "price", e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Margin %"
            value={item.margin}
            onChange={(e) => handleItemChange(index, "margin", e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={() => removeItemRow(index)}
            className="text-red-500 text-sm hover:underline"
          >
            ✖ Remove
          </button>
        </div>
      ))}

      <button
        onClick={addItemRow}
        className="text-blue-600 underline text-sm mb-4"
      >
        + Add Item
      </button>

      {/* Service Fee */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Service Fee ($)</label>
        <input
          type="number"
          value={serviceFee}
          onChange={(e) => setServiceFee(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Total Calculation */}
      <div className="mb-6">
        <button
          onClick={calculateTotal}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Calculate Total
        </button>
        <p className="mt-2 text-lg font-bold">
          Total Quote: ${total.toFixed(2)}
        </p>
      </div>

      {/* Save Quote Placeholder */}
      <button className="w-full bg-blue-600 text-white py-3 rounded">
        Save Quote (Firebase later)
      </button>
    </div>
  );
}
