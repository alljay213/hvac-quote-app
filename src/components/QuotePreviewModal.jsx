export default function QuotePreviewModal({
  client,
  items,
  serviceFee,
  total,
  onClose,
  onConfirm,
}) {
  const TAX_RATE = 0.13;

  const itemTotal = items.reduce((sum, item) => {
    const cost = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity) || 1;
    const margin = parseFloat(item.margin) || 0;
    return sum + cost * qty * (1 + margin / 100);
  }, 0);

  const fee = parseFloat(serviceFee || 0);
  const subtotal = itemTotal + fee;
  const tax = subtotal * TAX_RATE;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black">
      <div className="bg-white w-full max-w-3xl rounded shadow-lg p-6 overflow-y-auto max-h-[90vh] relative">
        <h3 className="text-xl font-bold mb-4">Quote Preview</h3>

        <div className="mb-4">
          <h4 className="font-semibold mb-1">Client Info</h4>
          <ul className="text-sm space-y-1">
            {Object.entries(client).map(
              ([k, v]) =>
                v && (
                  <li key={k}>
                    <strong>{k}:</strong> {v}
                  </li>
                )
            )}
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-1">Items</h4>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Cat#</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Margin %</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const cost = parseFloat(item.price) || 0;
                const qty = parseInt(item.quantity) || 1;
                const margin = parseFloat(item.margin) || 0;
                const total = cost * qty * (1 + margin / 100);
                return (
                  <tr key={i}>
                    <td className="p-2 border">{item.catNo}</td>
                    <td className="p-2 border">{item.description}</td>
                    <td className="p-2 border">${cost.toFixed(2)}</td>
                    <td className="p-2 border">{qty}</td>
                    <td className="p-2 border">{margin}%</td>
                    <td className="p-2 border font-medium">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mb-4 text-sm space-y-1">
          <p>
            <strong>Service Fee:</strong> {formatCurrency(fee)}
          </p>
          <p>
            <strong>Tax (13%):</strong> {formatCurrency(tax)}
          </p>
          <p className="text-lg font-bold">
            Total Quote: {formatCurrency(total)}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
}
