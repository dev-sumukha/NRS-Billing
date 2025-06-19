import React, { useContext, useEffect, useState } from "react";
import { PlusCircle, Edit, Trash2, ReceiptText } from "lucide-react";
import axios from "axios";
import userContext from "../store/UserContext";
import { Link } from "react-router-dom";

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customerName: "",
    shopName: "",
    GSTNumber: "",
    amountBalance: 0,
    amountPaid: 0,
    place: "",
    vouchers: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token } = useContext(userContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/customer/createCustomer`,
        newCustomer,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewCustomer({
        customerName: "",
        shopName: "",
        GSTNumber: "",
        amountBalance: 0,
        amountPaid: 0,
        place: "",
        vouchers: [],
      });
      setShowModal(false);
      setCustomers((prevCustomers) => [...prevCustomers, res.data.customer]);
      alert("Customer created successfully!");
    } catch (error) {
      setError("Failed to create customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customerId) => {
    const customerToEdit = customers.find((c) => c._id === customerId);
    console.log("Edit Customer:", customerToEdit);
  };

  const handleDelete = async (customerId) => {
    try {
      await axios.delete(
        `$${import.meta.env.VITE_BACKEND_URL}api/customer/deleteCustomer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCustomers(customers.filter((c) => c._id !== customerId));
      alert("Customer deleted successfully!");
    } catch (error) {
      alert("Failed to delete customer. Please try again.");
    }
  };

  const getCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/customer/getCustomers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCustomers(res.data.customerList);
    } catch (error) {
      setError("Failed to fetch customers. Please reload.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Customers</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-[#2D69D4] text-white rounded-lg hover:bg-[#4A80DB] transition-colors"
        >
          <PlusCircle className="mr-2" />
          Add Customer
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-500 bg-red-100 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Customer List */}
      {loading ? (
        <div>Loading customers...</div>
      ) : (
        <div className="bg-white p-4 shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Shop Name</th>
                <th className="px-6 py-3">GST Number</th>
                <th className="px-6 py-3">Amount Balance</th>
                <th className="px-6 py-3">Amount Paid</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No customers to display 🤧
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4">{customer.customerName}</td>
                    <td className="px-6 py-4">{customer.shopName}</td>
                    <td className="px-6 py-4">{customer.GSTNumber}</td>
                    <td className="px-6 py-4">{customer.amountBalance}</td>
                    <td className="px-6 py-4">{customer.amountPaid}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(customer._id)}
                        className="mr-2 text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <Edit className="inline-block" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="inline-block" />
                      </button>
                      <Link
                        to={`/dashboard/customers/voucher/getVouchers/${customer._id}`}
                      >
                        <span
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          title="View Vouchers"
                        >
                          <ReceiptText className="inline-block" />
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal to add new customer */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Add Customer</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="customerName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={newCustomer.customerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="shopName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Shop Name
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={newCustomer.shopName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter shop name"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="GSTNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  GST Number
                </label>
                <input
                  type="text"
                  id="GSTNumber"
                  name="GSTNumber"
                  value={newCustomer.GSTNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md uppercase"
                  placeholder="Enter GST Number"
                  autoCapitalize="characters"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="place"
                  className="block text-sm font-medium text-gray-700"
                >
                  Place
                </label>
                <input
                  type="text"
                  id="place"
                  name="place"
                  value={newCustomer.place}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter place"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2D69D4] text-white rounded-lg hover:bg-[#4A80DB] transition-colors"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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

export default CustomerPage;
