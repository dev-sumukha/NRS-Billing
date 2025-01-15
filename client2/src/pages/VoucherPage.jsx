import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams hook
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
  // Get customerId and voucherId from URL parameters
  const { customerId, voucherId } = useParams();

  const [rows, setRows] = useState([
    { id: Date.now(), itemName: "", companyName: "", qty: 0, rate: 0, amount: 0 },
  ]);
  const [total, setTotal] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [activeRow, setActiveRow] = useState(0); // Track the currently active row

  // Handle Input Change for Items and Calculations
  const handleInputChange = async (index, field, value) => {
    setActiveRow(index); // Update the active row

    const updatedRows = [...rows];
    updatedRows[index][field] = field === "qty" || field === "rate" ? +value : value;

    // Fetch item suggestions only for the active row and for the "itemName" field
    if (field === "itemName" && value.length > 2 && index === activeRow) {
      fetchSuggestions(value);
    } else {
      // Only clear suggestions if input is less than or equal to 2 characters
      // and the user is not navigating through suggestions
      if (highlightedIndex === -1) {
        setSuggestions([]);
      }
    }

    // Calculate Amount for the Row
    if (field === "qty" || field === "rate") {
      updatedRows[index].amount = updatedRows[index].qty * updatedRows[index].rate;
    }

    setRows(updatedRows);
  };

  const fetchSuggestions = debounce(async (query) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/items/suggestItems?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(res.data.itemList);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 500);

  const handleKeyDown = (index, event) => {
    if (event.key === "Enter" && index === rows.length - 1) {
      event.preventDefault();
      addRow();
    }

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
      handleItemSelect(index, suggestions[highlightedIndex]);
      setHighlightedIndex(-1);
    }
  };

  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), itemName: "", companyName: "", qty: 0, rate: 0, amount: 0 },
    ]);
  };

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
    setSuggestions([]);
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    const newTotal = rows.reduce((acc, row) => acc + row.amount, 0);
    setTotal(newTotal);
  }, [rows]);

  const saveAsDraft = async () => {
    try {
      const payload = { items: rows, total }; // Prepare the data to send
      // const res = await axios.patch(
      //   `http://localhost:3000/api/items/customers/${customerId}/vouchers/${voucherId}/addItems`,
      //   payload,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`, // Pass token for authorization
      //     },
      //   }
      // );
      // console.log(res);

      console.log(payload);
    } catch (error) {
      console.error("Error saving draft data:", error);
      alert("Error saving draft data.");
    }
  };
  

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">Add Items</h1>
      <p className="text-2xl font-bold">Customer ID: {customerId}</p>
      <p className="text-2xl font-bold">Voucher ID: {voucherId}</p>
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
            <tr key={row.id}>
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
                {suggestions.length > 0 && index === activeRow && (
                  <ul className="absolute bg-white border border-gray-300 rounded shadow-md w-full z-10">
                    {suggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        onClick={() => handleItemSelect(index, suggestion)}
                        className={`cursor-pointer px-2 py-1 hover:bg-gray-200 ${
                          highlightedIndex === i ? "bg-gray-200" : ""
                        }`}
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
                  className="w-full border border-gray-300 px-2 py-1 rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={row.rate}
                  onChange={(e) => handleInputChange(index, "rate", e.target.value)}
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
            <td colSpan="5" className="text-right font-semibold px-4 py-2 border-t">Total</td>
            <td colSpan="2" className="text-left font-semibold px-4 py-2 border-t">{total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <button
        onClick={saveAsDraft}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Save as Draft
      </button>
    </div>
  );
}

export default VoucherPage;
