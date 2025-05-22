import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import QuotePreviewModal from "./QuotePreviewModal";

// Sanitize helper
const sanitize = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/<[^>]*>?/gm, "") // Remove HTML tags
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();
};

export default function QuoteBuilder() {
  const [client, setClient] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    unit: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const [itemList, setItemList] = useState([
    { catNo: "", description: "", price: "", quantity: "", margin: "" },
  ]);

  const [serviceFee, setServiceFee] = useState("");
  const [total, setTotal] = useState(0);

  const [showPreview, setShowPreview] = useState(false);

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
      { catNo: "", description: "", price: "", quantity: "", margin: "" },
    ]);
  };

  const removeItemRow = (index) => {
    const updated = itemList.filter((_, i) => i !== index);
    setItemList(updated);
  };

  const calculateTotal = () => {
    let subtotal = itemList.reduce((sum, item) => {
      const cost = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      const margin = parseFloat(item.margin) || 0;
      const markedUp = cost * quantity * (1 + margin / 100);
      return sum + markedUp;
    }, 0);

    const fee = parseFloat(serviceFee) || 0;
    setTotal(subtotal + fee);
  };

  const saveQuote = async () => {
    if (
      !client.name ||
      !client.phone ||
      !client.email ||
      !client.street ||
      !client.city ||
      !client.province ||
      !client.postalCode
    ) {
      alert("Please fill out all required client fields.");
      return;
    }

    const safeClient = {
      name: sanitize(client.name),
      phone: sanitize(client.phone),
      email: sanitize(client.email),
      street: sanitize(client.street),
      unit: sanitize(client.unit),
      city: sanitize(client.city),
      province: sanitize(client.province),
      postalCode: sanitize(client.postalCode),
    };

    const parsedItems = itemList.map((item) => {
      const cost = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      const margin = parseFloat(item.margin) || 0;
      const sellingPrice = cost * quantity * (1 + margin / 100);
      return {
        catNo: sanitize(item.catNo),
        description: sanitize(item.description),
        price: cost,
        quantity,
        margin,
        sellingPrice: parseFloat(sellingPrice.toFixed(2)),
      };
    });

    const fee = parseFloat(serviceFee) || 0;
    const totalValue =
      parsedItems.reduce((sum, item) => sum + item.sellingPrice, 0) + fee;

    try {
      await addDoc(collection(db, "quotes"), {
        client: safeClient,
        items: parsedItems,
        serviceFee: fee,
        total: parseFloat(totalValue.toFixed(2)),
        createdAt: serverTimestamp(),
      });

      alert("Quote saved successfully!");

      // Reset form
      setClient({
        name: "",
        phone: "",
        email: "",
        street: "",
        unit: "",
        city: "",
        province: "",
        postalCode: "",
      });
      setItemList([
        { catNo: "", description: "", price: "", quantity: "", margin: "" },
      ]);
      setServiceFee("");
      setTotal(0);
    } catch (err) {
      alert("Error saving quote: " + err.message);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md text-black">
        <h2 className="text-2xl font-bold mb-4 ">HVAC Quote Builder</h2>

        {/* Client Info */}
        <div className="grid gap-4 mb-6 ">
          <input
            type="text"
            name="name"
            placeholder="Client Name"
            value={client.name}
            onChange={handleClientChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={client.phone}
            onChange={handleClientChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={client.email}
            onChange={handleClientChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={client.street}
            onChange={handleClientChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            name="unit"
            placeholder="Suite / Unit # (optional)"
            value={client.unit}
            onChange={handleClientChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={client.city}
            onChange={handleClientChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            name="province"
            placeholder="Province"
            value={client.province}
            onChange={handleClientChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={client.postalCode}
            onChange={handleClientChange}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>

        {/* Items */}
        <h3 className="font-semibold mb-2">Items</h3>
        {itemList.map((item, index) => (
          <div key={index} className="grid grid-cols-6 gap-3 mb-3 items-center">
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
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Margin %"
              value={item.margin}
              onChange={(e) =>
                handleItemChange(index, "margin", e.target.value)
              }
              className="p-2 border rounded"
            />
            <button
              onClick={() => removeItemRow(index)}
              className="text-red-500 text-sm hover:underline"
            >
              ✖
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

        {/* Total */}
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

        {/* Save */}
        <button
          onClick={() => setShowPreview(true)}
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          Preview Quote
        </button>
      </div>
      {showPreview && (
        <QuotePreviewModal
          client={client}
          items={itemList}
          serviceFee={serviceFee}
          total={total}
          onClose={() => setShowPreview(false)}
          onConfirm={() => {
            saveQuote();
            setShowPreview(false);
          }}
        />
      )}
    </>
  );
}
