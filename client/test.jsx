import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import userContext from "../store/UserContext";

const debounce = (fn, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

function VoucherPage() {
  const { token } = useContext(userContext);

  const [rows, setRows] = useState([
    { id: Date.now(), itemName: "", companyName: "", qty: 0, rate: 0, amount: 0 },
  ]);
  const [total, setTotal] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Track highlighted suggestion index

  // Handle Input Change for Items and Calculations
  const handleInputChange = async (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = field === "qty" || field === "rate" ? +value : value;

    // Fetch item suggestions based on the input value
    if (field === "itemName" && value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]); // Clear suggestions if input is less than or equal to 2 characters
    }

    // Calculate Amount for the Row
    if (field === "qty" || field === "rate") {
      updatedRows[index].amount = updatedRows[index].qty * updatedRows[index].rate;
    }

    setRows(updatedRows);
    setHighlightedIndex(-1); // Reset highlighted index when input changes
  };

  const fetchSuggestions = debounce(async (query) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/items/suggestItems?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(res.data.itemList);
      setHighlightedIndex(-1); // Reset highlighted index when new suggestions are fetched
    } catch (error) {
      console.log("Error fetching suggestions:", error);
    }
  }, 500);

  // Handle Enter Key to Add Row or Select Suggestion
  const handleKeyDown = (index, event) => {
    if (event.key === "Enter" && index === rows.length - 1) {
      event.preventDefault(); // Prevent default behavior
      addRow(); // Add a new row
    }

    // Handle arrow keys for navigating suggestions
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (highlightedIndex < suggestions.length - 1) {
        setHighlightedIndex((prevIndex) => prevIndex + 1);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (highlightedIndex > 0) {
        setHighlightedIndex((prevIndex) => prevIndex - 1);
      }
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      // Select highlighted suggestion
      handleItemSelect(index, suggestions[highlightedIndex]);
      setHighlightedIndex(-1); // Reset highlighted index after selection
    }
  };

  // Add a New Row
  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), itemName: "", companyName: "", qty: 0, rate: 0, amount: 0 },
    ]);
  };

  // Remove a Row
  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleItemSelect = (index, selectedItem) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      itemName: selectedItem.itemName,
      companyName: selectedItem.company,
      rate: selectedItem.rate,
      qty: 1,
      amount: selectedItem.rate,
    };

    setRows(updatedRows);
    setSuggestions([]); // Clear suggestions after selection
    setHighlightedIndex(-1); // Reset highlighted index after selection
  };

  useEffect(() => {
    const newTotal = rows.reduce((acc, row) => acc + row.amount, 0);
    setTotal(newTotal);
  }, [rows]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">Add Items</h1>

      {/* Items Table */}
      <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg mt-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Item Name</th>
            <th className="border border-gray-300 px-4 py-2">Company Name</th>
            <th className="border border-gray-300 px-4 py-2">Qty</th>
            <th className="border border-gray-300 px-4 py-2">Rate</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2 relative">
                <input
                  type="text"
                  value={row.itemName}
                  onChange={(e) => handleInputChange(index, "itemName", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full border border-gray-300 px-2 py-1 rounded"
                  placeholder="Type item name"
                />
                {/* Dropdown for item suggestions */}
                {suggestions.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 rounded shadow-md w-full z-10">
                    {suggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        onClick={() => handleItemSelect(index, suggestion)}
                        className={`cursor-pointer px-2 py-1 hover:bg-gray-200 ${highlightedIndex === i ? 'bg-gray-200' : ''}`}
                      >
                        {suggestion.itemName}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">{row.companyName}</td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={row.qty}
                  onChange={(e) => handleInputChange(index, "qty", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full border border-gray-300 px-2 py-1 rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={row.rate}
                  onChange={(e) => handleInputChange(index, "rate", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full border border-gray-300 px-2 py-1 rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">{row.amount.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2">
                {rows.length > 1 && (
                  <button
                    onClick={() => removeRow(index)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5" className="text-right font-semibold px-4 py-2 border-t">
              Total
            </td>
            <td colSpan="2" className="text-left font-semibold px-4 py-2 border-t">
              {total.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default VoucherPage;
