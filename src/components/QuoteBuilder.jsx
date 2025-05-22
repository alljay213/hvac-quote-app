import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import QuotePreviewModal from "./QuotePreviewModal";

// Constants
const TAX_RATE = 0.13;
const sanitize = (str) =>
  typeof str === "string"
    ? str
        .replace(/<[^>]*>?/gm, "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim()
    : "";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);

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
  const [tax, setTax] = useState(0);
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
    const itemTotal = itemList.reduce((sum, item) => {
      const cost = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      const margin = parseFloat(item.margin) || 0;
      return sum + cost * quantity * (1 + margin / 100);
    }, 0);

    const fee = parseFloat(serviceFee) || 0;
    const subtotal = itemTotal + fee;
    const taxAmt = subtotal * TAX_RATE;

    setTax(taxAmt);
    setTotal(subtotal + taxAmt);
  };

  const saveQuote = async () => {
    const required = [
      "name",
      "phone",
      "email",
      "street",
      "city",
      "province",
      "postalCode",
    ];
    if (required.some((key) => !client[key])) {
      alert("Please fill out all required client fields.");
      return;
    }

    const safeClient = Object.fromEntries(
      Object.entries(client).map(([k, v]) => [k, sanitize(v)])
    );

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
    const itemTotal = parsedItems.reduce(
      (sum, item) => sum + item.sellingPrice,
      0
    );
    const subtotal = itemTotal + fee;
    const taxAmt = subtotal * TAX_RATE;
    const totalValue = subtotal + taxAmt;

    try {
      await addDoc(collection(db, "quotes"), {
        client: safeClient,
        items: parsedItems,
        serviceFee: fee,
        tax: parseFloat(taxAmt.toFixed(2)),
        total: parseFloat(totalValue.toFixed(2)),
        createdAt: serverTimestamp(),
      });

      alert("Quote saved successfully!");
      resetForm();
    } catch (err) {
      alert("Error saving quote: " + err.message);
    }
  };

  const resetForm = () => {
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
    setTax(0);
    setTotal(0);
  };

  const isDisabled =
    !client.name ||
    !client.phone ||
    !client.email ||
    !client.street ||
    !client.city ||
    !client.province ||
    !client.postalCode ||
    itemList.length === 0;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md text-black">
        <h2 className="text-2xl font-bold mb-4">HVAC Quote Builder</h2>

        {/* Client Info */}
        <div className="grid gap-4 mb-6">
          {[
            "name",
            "phone",
            "email",
            "street",
            "unit",
            "city",
            "province",
            "postalCode",
          ].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={
                field === "unit"
                  ? "Suite / Unit # (optional)"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              value={client[field]}
              onChange={handleClientChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          ))}
        </div>

        <div className="border-t border-gray-300 my-6" />

        {/* Items */}
        <h3 className="font-semibold mb-2">Items</h3>
        {itemList.map((item, index) => (
          <div key={index} className="grid grid-cols-6 gap-3 mb-3 items-center">
            {["catNo", "description", "price", "quantity", "margin"].map(
              (field) => (
                <input
                  key={field}
                  placeholder={
                    {
                      catNo: "Cat#",
                      description: "Description",
                      price: "Price",
                      quantity: "Qty",
                      margin: "Margin %",
                    }[field]
                  }
                  type={
                    field === "price" ||
                    field === "quantity" ||
                    field === "margin"
                      ? "number"
                      : "text"
                  }
                  value={item[field]}
                  onChange={(e) =>
                    handleItemChange(index, field, e.target.value)
                  }
                  className="p-2 border rounded"
                />
              )
            )}
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

        <div className="border-t border-gray-300 my-6" />

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

        {/* Totals */}
        <div className="mb-6 space-y-1">
          <button
            onClick={calculateTotal}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Calculate Total
          </button>
          <p>Tax (13%): {formatCurrency(tax)}</p>
          <p className="text-lg font-bold">
            Total Quote: {formatCurrency(total)}
          </p>
        </div>

        <button
          onClick={() => setShowPreview(true)}
          disabled={isDisabled}
          className={`w-full py-3 rounded text-white font-semibold ${
            isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Preview Quote
        </button>
      </div>

      {showPreview && (
        <QuotePreviewModal
          client={client}
          items={itemList}
          serviceFee={parseFloat(serviceFee)}
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
