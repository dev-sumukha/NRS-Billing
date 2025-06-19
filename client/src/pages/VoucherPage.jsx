// No imports changed
import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
  const { customerId, voucherId } = useParams();

  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ itemName: "", companyName: "", qty: "", rate: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [editIndex, setEditIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef();

  const [subtotal, setSubtotal] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchSuggestions = debounce(async (query) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/items/suggestItems`, { query }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuggestions(res.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 300);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "itemName" && value.length > 1) fetchSuggestions(value);
    if (name === "itemName" && value.length <= 1) setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    setForm({ ...form, itemName: item.itemName, companyName: item.company });
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleAddOrUpdate = () => {
    const qty = parseFloat(form.qty);
    const rate = parseFloat(form.rate);
    if (!form.itemName || !qty || !rate) return;

    const amount = qty * rate;
    const newItem = { ...form, qty, rate, amount };

    let updated = [...rows];
    if (editIndex !== -1) {
      updated[editIndex] = newItem;
      setEditIndex(-1);
    } else {
      updated.push(newItem);
    }
    setRows(updated);
    setForm({ itemName: "", companyName: "", qty: "", rate: "" });
    inputRef.current?.focus();
  };

  const handleEdit = (idx) => {
    const item = rows[idx];
    setForm({ itemName: item.itemName, companyName: item.companyName, qty: item.qty, rate: item.rate });
    setEditIndex(idx);
    inputRef.current?.focus();
  };

  const handleDelete = (idx) => {
    const updated = [...rows];
    updated.splice(idx, 1);
    setRows(updated);
    setEditIndex(-1);
  };

  useEffect(() => {
    const sub = rows.reduce((sum, item) => sum + item.amount, 0);
    const sgstAmt = sub * 0.09;
    const cgstAmt = sub * 0.09;
    const totalAmt = sub + sgstAmt + cgstAmt;

    setSubtotal(sub);
    setSgst(sgstAmt);
    setCgst(cgstAmt);
    setTotal(totalAmt);
  }, [rows]);

  const saveAsDraft = async () => {
    try {
      const mappedItems = rows.map((item) => ({
        item: item.itemName,      // ✅ match schema
        companyName: item.companyName,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount
      }));

      const payload = {
        items: mappedItems,
        total: total // optional — if backend accepts it
      };

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/items/customers/${customerId}/vouchers/${voucherId}/addItems`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Saved:", res.data);
      alert("Draft saved successfully");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Error saving draft.");
    }
  };

  useEffect(() => {
    const fetchVoucherItems = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/items/customers/${customerId}/vouchers/${voucherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedItems = res.data?.voucher?.items || [];
        const restored = fetchedItems.map(item => ({
          itemName: item.item,
          companyName: item.companyName, // Optional: You can resolve company name via separate lookup
          qty: item.qty,
          rate: item.rate,
          amount: item.amount,
        }));
        console.log(res.data.voucher.items);
        setRows(restored);
      } catch (err) {
        console.error("❌ Failed to load voucher items", err);
      }
    };

    fetchVoucherItems();
  }, [customerId, voucherId, token]);



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow space-y-4">
        <h1 className="text-3xl font-bold text-blue-700">Voucher Entry</h1>
        <p className="text-lg">Customer ID: {customerId}</p>
        <p className="text-lg">Voucher ID: {voucherId}</p>

        {/* Input Row */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          <div className="col-span-1 relative">
            <input
              ref={inputRef}
              type="text"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Item Name"
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded w-full shadow mt-1 max-h-48 overflow-auto">
                {suggestions.map((item, i) => (
                  <li
                    key={i}
                    onClick={() => handleSelectSuggestion(item)}
                    className={`px-3 py-2 cursor-pointer ${highlightedIndex === i ? "bg-blue-100" : "hover:bg-gray-100"}`}
                  >
                    <div className="font-medium">{item.itemName}</div>
                    <div className="text-sm text-gray-500">{item.company}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input type="text" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company" className="border px-3 py-2 rounded" disabled />
          <input type="number" name="qty" value={form.qty} onChange={handleChange} placeholder="Qty" className="border px-3 py-2 rounded" />
          <input type="number" name="rate" value={form.rate} onChange={handleChange} placeholder="Rate" className="border px-3 py-2 rounded" />
          <button onClick={handleAddOrUpdate} className={`${editIndex !== -1 ? "bg-green-600" : "bg-blue-600"} text-white px-4 py-2 rounded hover:opacity-90`}>
            {editIndex !== -1 ? "Update" : "Add"}
          </button>
        </div>

        {/* Item Table */}
        <table className="w-full table-auto mt-6 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Item</th>
              <th className="border px-4 py-2">Company</th>
              <th className="border px-4 py-2">Rate</th>
              <th className="border px-4 py-2">Qty</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{row.itemName}</td>
                <td className="border px-4 py-2">{row.companyName}</td>
                <td className="border px-4 py-2">{row.rate}</td>
                <td className="border px-4 py-2">{row.qty}</td>
                <td className="border px-4 py-2">{row.amount.toFixed(2)}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(idx)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(idx)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="text-right text-lg text-blue-800 font-semibold space-y-1 mt-6">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>SGST (9%): ₹{sgst.toFixed(2)}</p>
          <p>CGST (9%): ₹{cgst.toFixed(2)}</p>
          <p>Total Items: {rows.length}</p>
          <p className="text-2xl">Total: ₹{total.toFixed(2)}</p>
        </div>

        <div className="text-right">
          <button
            onClick={saveAsDraft}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoucherPage;
