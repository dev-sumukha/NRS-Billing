import React, { useState, useContext, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import userContext from "../store/UserContext";

function ItemPage() {
  const [items, setItems] = useState([]);  // Fix: Initialize as empty array
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: '',
    company: '',
    rate: 0,
    caseQuantity: 0,
    stock: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const { token } = useContext(userContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/items/createItem",newItem,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data);
      setShowModal(false)
      setNewItem({    
        itemName: '',
        company: '',
        rate: 0,
        caseQuantity: 0,
        stock: 0,
      })
      setItems((prevItems) => [...prevItems,res.data.item])
    } catch (error) {
      console.log("Error");
    }
  };

  const handleEdit = (itemId) => {
    const itemToEdit = items.find((i) => i._id === itemId);
    setNewItem({ ...itemToEdit });
    setEditingItem(itemToEdit);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      setItems((prevItems) => prevItems.filter((i) => i._id !== id));
      const res = await axios.delete(
        `http://localhost:3000/api/items/deleteItem/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log("Error deleting item", err);
    }
  };

  const getItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:3000/api/items/getItems",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(res.data.itemsList);
    } catch (err) {
      console.log("Error fetching items", err);
      setError('Failed to fetch items.');
    }
    setLoading(false);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Items</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-[#2D69D4] text-white rounded-lg hover:bg-[#4A80DB] transition-colors"
        >
          <PlusCircle className="mr-2" />
          Add Item
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Loading Spinner */}
      {loading && <div className="text-center">Loading...</div>}

      {/* Item List */}
      <div className="bg-white p-4 shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Item Name</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Rate</th>
              <th className="px-6 py-3">Case Quantity</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No items to display</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">{item.itemName}</td>
                  <td className="px-6 py-4">{item.company}</td>
                  <td className="px-6 py-4">{item.rate}</td>
                  <td className="px-6 py-4">{item.caseQuantity}</td>
                  <td className="px-6 py-4">{item.stock}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="mr-2 text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <Edit className="inline-block" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="inline-block" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal to add/edit item */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit Item' : 'Add Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={newItem?.itemName || ''} // Fix: Ensure that newItem is not undefined
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={newItem?.company || ''} // Fix: Ensure that newItem is not undefined
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Rate</label>
                <input
                  type="number"
                  id="rate"
                  name="rate"
                  value={newItem?.rate || 0} // Fix: Ensure that newItem is not undefined
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter rate"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="caseQuantity" className="block text-sm font-medium text-gray-700">Case Quantity</label>
                <input
                  type="number"
                  id="caseQuantity"
                  name="caseQuantity"
                  value={newItem?.caseQuantity || 0} // Fix: Ensure that newItem is not undefined
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter case quantity"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={newItem?.stock || 0} // Fix: Ensure that newItem is not undefined
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter stock"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2D69D4] text-white rounded-lg hover:bg-[#4A80DB] transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ItemPage;
